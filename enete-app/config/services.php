<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'egon' => [
        'url' => env('EGON_API_URL', 'https://api.egon.example.com/'),
        'token' => 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ5SGNwTmN1ZmN6WVJyc3FNRSIsImFwcElkIjoibXdkV1d3RXhMRjZnd2o5cTUiLCJzZXJ2aWNlTmFtZSI6IlVzZXJTZXJ2aWNlIiwiZWdvbkFwaUtleSI6ImEwNjk2Zjk4MzZkMjllZDgzMWIyYjI2NDBmY2Y5ZjEyIiwiaWF0IjoxNjMzNjc3MzI0fQ.nE0yQRZbh0ooVOTprLf97veamfCYrM2Saqqsp_k8Pr4',
        'reseller_id' => env('EGON_RESELLER_ID'),
    ],

];
