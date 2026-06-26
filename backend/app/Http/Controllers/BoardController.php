<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        return Board::with('lists.cards')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $board = Board::create($validated);
        return response()->json($board, 201);
    }

    public function show(Board $board)
    {
        return $board->load('lists.cards');
    }

    public function update(Request $request, Board $board)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $board->update($validated);
        return $board;
    }

    public function destroy(Board $board)
    {
        $board->delete();
        return response()->noContent();
    }
}
