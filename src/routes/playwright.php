<?php

use Illuminate\Support\Facades\Route;
use WebId\LaravelPlaywright\Controllers\PlaywrightController;

Route::post('/__playwright__/factory', [PlaywrightController::class, 'factory'])->name('playwright.factory');
Route::post('/__playwright__/login', [PlaywrightController::class, 'login'])->name('playwright.login');
Route::post('/__playwright__/logout', [PlaywrightController::class, 'logout'])->name('playwright.logout');
Route::post('/__playwright__/artisan', [PlaywrightController::class, 'artisan'])->name('playwright.artisan');
Route::post('/__playwright__/run-php', [PlaywrightController::class, 'runPhp'])->name('playwright.run-php');
Route::get('/__playwright__/csrf_token', [PlaywrightController::class, 'csrfToken'])->name('playwright.csrf-token');
Route::post('/__playwright__/routes', [PlaywrightController::class, 'routes'])->name('playwright.routes');
Route::post('/__playwright__/current-user', [PlaywrightController::class, 'currentUser'])->name('playwright.current-user');
