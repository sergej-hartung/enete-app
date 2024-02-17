<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ваши учетные данные</title>
</head>
<body>
    <h1>Добро пожаловать!</h1>
    <p>Ваши учетные данные для входа:</p>
    <ul>
        <li>Логин: {{ $login }}</li>
        <li>Пароль: {{ $password }}</li>
    </ul>
    <p>Рекомендуем сменить пароль после первого входа в систему.</p>
</body>
</html>