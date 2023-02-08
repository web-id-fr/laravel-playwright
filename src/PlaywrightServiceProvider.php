<?php

namespace WebId\LaravelPlaywright;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class PlaywrightServiceProvider extends ServiceProvider
{
    public function boot()
    {
        if ($this->app->environment('production')) {
            return;
        }

        $this->addRoutes();

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/routes/playwright.php' => base_path('routes/playwright.php'),
            ]);

            $this->commands([
                PlaywrightBoilerplateCommand::class,
            ]);
        }
    }

    protected function addRoutes()
    {
        Route::namespace('')
            ->middleware('web')
            ->group(__DIR__.'/routes/playwright.php');
    }
}
