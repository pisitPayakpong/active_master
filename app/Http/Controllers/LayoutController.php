<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission;

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
        $renderMenu = Permission::where('type', auth()->user()->role)->first();
        
        $imgUrl = auth()->user()->image;

        $data = [
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'render_menu' => !empty($renderMenu) ? $renderMenu->params['config_menu']: [],
            'imgUrl' => $imgUrl];
        
        return view('main', ['viewState' => collect($data)]);
    }
}
