<?php

namespace App\Mail;

use App\Models\User\UserProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $profile;

    /**
     * Создание нового экземпляра сообщения.
     *
     * @param User $user
     * @return void
     */
    public function __construct(UserProfile $profile)
    {
        $this->profile = $profile;
    }

    /**
     * Построение сообщения.
     *
     * @return $this
     */
    public function build()
    {
        $verificationUrl = url('/email/verify/'.$this->profile->email_verification_hash); // URL для подтверждения

        return $this->view('emails.verify') // используйте шаблон emails.verify
                    ->with([
                        'verificationUrl' => $verificationUrl,
                        'userName' => $this->profile->first_name .' '. $this->profile->last_name, // или login_name, в зависимости от вашей модели
                    ]);
    }

    // /**
    //  * Get the message envelope.
    //  */
    // public function envelope(): Envelope
    // {
    //     return new Envelope(
    //         subject: 'Verify Email',
    //     );
    // }

    // /**
    //  * Get the message content definition.
    //  */
    // public function content(): Content
    // {
    //     return new Content(
    //         view: 'view.name',
    //     );
    // }

    // /**
    //  * Get the attachments for the message.
    //  *
    //  * @return array<int, \Illuminate\Mail\Mailables\Attachment>
    //  */
    // public function attachments(): array
    // {
    //     return [];
    // }
}
