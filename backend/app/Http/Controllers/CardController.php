<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\KanbanList;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function store(Request $request, KanbanList $list)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $position = $list->cards()->max('position') + 1;
        $card = $list->cards()->create([...$validated, 'position' => $position]);

        return response()->json($card, 201);
    }

    public function update(Request $request, Card $card)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'position' => 'sometimes|integer|min:0',
            'list_id' => 'sometimes|exists:kanban_lists,id',
        ]);

        $card->update($validated);
        return $card;
    }

    public function destroy(Card $card)
    {
        $card->delete();
        return response()->noContent();
    }
}
