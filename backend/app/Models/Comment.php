<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $fillable = [
        'thread_id',
        'user_id',
        'parent_id',
        'content',
        'ups',
        'downs',
    ];

    public function parent()
    {
        return $this->belongsTo(Comment::class , 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class , 'parent_id');
    }

    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->morphMany(Vote::class , 'votable');
    }
}
