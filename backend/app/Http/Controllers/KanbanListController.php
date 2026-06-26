<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\KanbanList;
use Illuminate\Http\Request;

class KanbanListController extends Controller
{
    public function store(Request $request, Board $board)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $position = $board->lists()->max('position') + 1;
        $list = $board->lists()->create([...$validated, 'position' => $position]);

        return response()->json($list, 201);
    }

    public function update(Request $request, KanbanList $list)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'position' => 'sometimes|integer|min:0',
        ]);

        $list->update($validated);
        return $list;
    }

    public function destroy(KanbanList $list)
    {
        $list->delete();
        return response()->noContent();
    }
}
