<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\KanbanListController;
use Illuminate\Support\Facades\Route;

Route::apiResource('boards', BoardController::class);
Route::apiResource('boards.lists', KanbanListController::class)->shallow();
Route::apiResource('lists.cards', CardController::class)->shallow();
