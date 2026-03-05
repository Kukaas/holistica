<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Vote extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'user_id',
        'votable_id',
        'votable_type',
        'value',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votable()
    {
        return $this->morphTo();
    }
}
