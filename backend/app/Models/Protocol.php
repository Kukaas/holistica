<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Protocol extends Model
{
    protected $fillable = [
        'title',
        'content',
        'author_id',
        'tags',
        'status',
        'avg_rating',
        'discussion_count',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function author()
    {
        return $this->belongsTo(User::class , 'author_id');
    }

    public function threads()
    {
        return $this->hasMany(Thread::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
