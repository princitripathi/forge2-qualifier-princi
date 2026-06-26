<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model
{
    use HasFactory;

    protected $fillable = ['list_id', 'title', 'description', 'position'];

    public function list(): BelongsTo
    {
        return $this->belongsTo(KanbanList::class, 'list_id');
    }
}
