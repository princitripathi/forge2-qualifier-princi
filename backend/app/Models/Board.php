<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description'];

    public function lists(): HasMany
    {
        return $this->hasMany(KanbanList::class)->orderBy('position');
    }
}
