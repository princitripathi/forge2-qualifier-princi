<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Card;
use App\Models\KanbanList;
use Illuminate\Database\Seeder;

class KanbanSeeder extends Seeder
{
    public function run(): void
    {
        $board = Board::create([
            'title' => 'Project Kanban',
            'description' => 'Main project board',
        ]);

        $backlog = KanbanList::create([
            'board_id' => $board->id,
            'title' => 'Backlog',
            'position' => 0,
        ]);

        $inProgress = KanbanList::create([
            'board_id' => $board->id,
            'title' => 'In Progress',
            'position' => 1,
        ]);

        $review = KanbanList::create([
            'board_id' => $board->id,
            'title' => 'Review',
            'position' => 2,
        ]);

        $done = KanbanList::create([
            'board_id' => $board->id,
            'title' => 'Done',
            'position' => 3,
        ]);

        Card::create(['list_id' => $backlog->id, 'title' => 'Research competitor tools', 'position' => 0]);
        Card::create(['list_id' => $backlog->id, 'title' => 'Define MVP scope', 'position' => 1]);
        Card::create(['list_id' => $backlog->id, 'title' => 'Setup CI/CD pipeline', 'position' => 2]);

        Card::create(['list_id' => $inProgress->id, 'title' => 'Build Kanban board UI', 'position' => 0]);
        Card::create(['list_id' => $inProgress->id, 'title' => 'Design card model & API', 'position' => 1]);

        Card::create(['list_id' => $review->id, 'title' => 'Code review: auth module', 'position' => 0]);

        Card::create(['list_id' => $done->id, 'title' => 'Project scaffolding', 'position' => 0]);
        Card::create(['list_id' => $done->id, 'title' => 'Git repo initialized', 'position' => 1]);
    }
}
