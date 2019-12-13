<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LayoutController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $renderMenu = [
            'dashboard', 'water',
        ];

        if (auth()->user()->isAdmin()) {
            $renderMenu = array_merge($renderMenu, ['user', 'register']);
        }

        $data = ['role' => auth()->user()->role, 'render_menu' => $renderMenu ];
        
        return view('main', ['viewState' => collect($data)]);
    }
}
