<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use App\Models\User\User;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendLoginDetails extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function build()
    {
        return $this->view('emails.loginDetails')
                    ->with([
                        'login' => $this->user->login_name, // Или другое поле для логина, если используется
                        'password' => $this->password,
                    ]);
    }
}
