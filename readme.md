# https://dreamteam-water-server.onrender.com

# Лайт версія документації

## TEST USER

    "email":"testUser@gmail.com",
    "password":"test1234"

## USER

Запит на регістрацію користувача - очікує { email, password }

      POST: https://dreamteam-water-server.onrender.com/api/users/register

Запит на логінізацію користувача - очікує { email, password }

      POST: https://dreamteam-water-server.onrender.com/api/users/login

Вихід

      POST: https://dreamteam-water-server.onrender.com/api/users/logout

Отримання користувача за токеном

      GET:  https://dreamteam-water-server.onrender.com/api/users/current

Зміна аватарки - очікує { avatar }

       PATCH: https://dreamteam-water-server.onrender.com/api/users/avatars

Верифікація пошти

      GET:  https://dreamteam-water-server.onrender.com/api/users/verify/:verificationToken

Реверифікація - очікує { email }

      POST: https://dreamteam-water-server.onrender.com/api/users/verify

Повертає інформацію поточного користувача

      GET:  https://dreamteam-water-server.onrender.com/api/users/info

Редагування інформації про користувача - очікує { name, email, gender, password },
або { name, email, gender, password, newPassword }

      PATCH:  https://dreamteam-water-server.onrender.com/api/users/info

## WATER

Запит поточного дня - очікує { date: Date }

      POST: https://dreamteam-water-server.onrender.com/api/water

Запит додавання випитого - очікує { ml: Number, time: String }

      POST: https://dreamteam-water-server.onrender.com/api/water/drinks/:dayID

Запит редагування випитого - очікує { ml: Number, time: String }

      PATCH: https://dreamteam-water-server.onrender.com/api/water/drinks/:drinkID

Запит видалення випитого

      DELETE: https://dreamteam-water-server.onrender.com/api/water/drinks/:drinkID

Запит отримання місяця - очікує { year: Number, month: Number }

      POST: https://dreamteam-water-server.onrender.com/api/water/month

Запит рудагування норми - очікує { date: Date, norm: Number }

      PATCH: https://dreamteam-water-server.onrender.com/api/water/norm
