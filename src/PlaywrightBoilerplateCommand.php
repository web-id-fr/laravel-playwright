<?php

namespace WebId\LaravelPlaywright;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Arr;

class PlaywrightBoilerplateCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'playwright:boilerplate';

    /**
     * The console command description.
     */
    protected $description = 'Generate useful Playwright boilerplate.';

    /**
     * The path to the user's desired playwright install.
     */
    protected string $playwrightPath;

    /**
     * Create a new Artisan command instance.
     */
    public function __construct(protected Filesystem $files)
    {
        parent::__construct();
    }

    /**
     * Handle the command.
     */
    public function handle()
    {
        if (!$this->isPlaywrightInstalled()) {
            $this->requirePlaywrightInstall();

            return;
        }

        $playwrightPaths = [
            'e2e' => (int)$this->files->exists(base_path('e2e')),
            'tests/e2e' => (int)$this->files->exists(base_path('tests/e2e')),
            'playwright' => (int)$this->files->exists(base_path('playwright')),
            'tests/playwright' => (int)$this->files->exists(base_path('tests/playwright')),
        ];
        $playwrightPathDefault = array_flip($playwrightPaths)[true] ?? 'e2e';

        $this->playwrightPath = trim(
            strtolower($this->ask('Where should we put the playwright directory? It should be the same directory you choose in the playwright installation wizard', $playwrightPathDefault)),
            '/'
        );

        $this->copyStubs();
    }

    /**
     * Copy the stubs from this package to the user's playwright folder.
     */
    protected function copyStubs(): void
    {
        $this->files->copyDirectory(__DIR__ . '/stubs', $this->playwrightPath());

        $this->status('Writing', $this->playwrightPath('laravel-helpers.ts', false));
        $this->status('Writing', $this->playwrightPath('laravel-examples.spec.ts', false));

        $this->line('');
    }

    /**
     * Get the user-requested path to the Playwright directory.
     */
    protected function playwrightPath(string $path = '', bool $absolute = true): string
    {
        $playwrightPath = $absolute ? base_path($this->playwrightPath) : $this->playwrightPath;

        return $playwrightPath . ($path ? DIRECTORY_SEPARATOR . $path : '');
    }

    /**
     * Report the status of a file to the user.
     */
    protected function status(string $type, string $file)
    {
        $this->line("<info>{$type}</info> <comment>{$file}</comment>");
    }

    /**
     * Require that the user first install playwright through npm.
     */
    protected function requirePlaywrightInstall()
    {
        $this->warn(
            <<<'EOT'

Playwright not found. Please install it through npm and try again.

npm init playwright@latest
yarn create playwright

EOT
        );
    }

    /**
     * Check if Playwright is added to the package.json file.
     */
    protected function isPlaywrightInstalled(): bool
    {
        $package = json_decode($this->files->get(base_path('package.json')), true);

        return Arr::get($package, 'devDependencies.@playwright/test') || Arr::get($package, 'dependencies.@playwright/test');
    }
}
