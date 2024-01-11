<?php

namespace App\Http\Controllers\User;

use App\Models\User\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class VerificationController extends Controller
{
    public function __invoke($hash, Request $request)
    {
        $user = User::where('email_verification_hash', $hash)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Invalid or expired link'], 404);
        }
        
        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        $user->email_verified_at = now();
        $user->save();

        return response()->json(['message' => 'Email successfully verified'], 200);
    }
}
