'use strict';

const express = require('express')
const path = require('path');

var dsConfig = require('../datasources.json');

module.exports = function(app) {
    var User = app.models.user
    app.set('view engine', 'pug')

    app.use('/robots.txt', express.static('public/robots.txt'))

    app.use('/', express.static('public'))

    app.get('/', function(req, res) {
        res.render('index', {})
    })

    //login page
    app.get('/login', function(req, res) {
        var credentials = dsConfig.emailDs.transports[0].auth;
        res.render('login', {
            email: credentials.user,
            password: credentials.pass
        });
    });

    //log a user in
    app.post('/login', function(req, res) {
        User.login({
            email: req.body.email,
            password: req.body.password
        }, 'user', function(err, token) {
            if (err) {
                if (err.details && err.code === 'LOGIN_FAILED_EMAIL_NOT_VERIFIED') {
                    res.render('reponseToTriggerEmail', {
                        title: 'Login failed',
                        content: err,
                        redirectToEmail: '/api/users/' + err.details.userId + '/verify',
                        redirectTo: '/',
                        redirectToLinkText: 'Click here',
                        userId: err.details.userId
                    });
                } else {
                    res.render('response', {
                        title: 'Login failed. Wrong username or password',
                        content: err,
                        redirectTo: '/',
                        redirectToLinkText: 'Please login again',
                    });
                }
                return;
            }
            res.render('home', {
                email: req.body.email,
                accessToken: token.id,
                redirectUrl: '/api/users/change-password?access_token=' + token.id
            });
        });
    });

    //verified
    app.get('/verified', function(req, res) {
        res.render('verified');
    });

    app.get('/logout', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
        User.logout(req.accessToken.id, function(err) {
            if (err) return next(err);
            res.redirect('/');
        });
    });

    //verified
    app.get('/verified', function(req, res) {
        res.render('verified');
    });

    app.get('/sheet/:CharacterId', function(req, res) {

        function getCharacter() {
            return new Promise(function(resolve, reject) {
                app.models.Character.findById(req.params.CharacterId, function(err, output) {
                    resolve(output)
                })
            })
        }

        function getAbilities() {
            return new Promise(function(resolve, reject) {
                app.models.Abilities.find({
                    where: {
                        CharacterId: req.params.CharacterId
                    },
                    order: 'id ASC',
                    limit: 6
                }, function(err, output) {
                    resolve(output)
                })
            })
        }

        function getSkills() {
            return new Promise(function(resolve, reject) {
                app.models.Skills.find({
                    where: {
                        CharacterId: req.params.CharacterId
                    },
                    order: 'id ASC',
                }, function(err, output) {
                    resolve(output)
                })
            })
        }

        async function main() {
            try {
                var character = await getCharacter();
                var abilities = await getAbilities();
                var skills = await getSkills();
                res.render('sheet/index', {
                    character: character,
                    abilities: abilities,
                    skills: skills
                })
            } catch (error) {
                console.error(error);
            }
        }

        main()

        //     skills: [{
        //             name: 'Blefowanie',
        //             code: 'blef',
        //             value3: 15,
        //             value4: null,
        //             ability: 'CHA',
        //         },
        //         {
        //             name: 'Ciche poruszanie',
        //             code: 'cich',
        //             value3: 15,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Czarostwo',
        //             code: 'czar',
        //             value3: 15,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Dyplomacja',
        //             code: 'dyplo',
        //             value3: null,
        //             value4: null,
        //             ability: 'CHA',
        //         },
        //         {
        //             name: 'Fałszerstwo',
        //             code: 'falsz',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Jeździectwo',
        //             code: 'jezdz',
        //             value3: null,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Koncentracja',
        //             code: 'konc',
        //             value3: 15,
        //             value4: null,
        //             ability: 'BD',
        //         },
        //         {
        //             name: 'Leczenie',
        //             code: 'lecz',
        //             value3: 5,
        //             value4: null,
        //             ability: 'RZT',
        //         },
        //         {
        //             name: 'Nasłuchiwanie',
        //             code: 'nasl',
        //             value3: 15,
        //             value4: null,
        //             ability: 'RZT',
        //         },
        //         {
        //             name: 'Odszyfrowanie Zapisków',
        //             code: 'odcyf',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Otwieranie Zamków',
        //             code: 'otzam',
        //             value3: null,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Postępowanie ze Zwierzętami',
        //             code: 'poszz',
        //             value3: null,
        //             value4: null,
        //             ability: 'CHA',
        //         },
        //         {
        //             name: 'Przebieranie',
        //             code: 'przeb',
        //             value3: null,
        //             value4: null,
        //             ability: 'CHA',
        //         },
        //         {
        //             name: 'Przeszukiwanie',
        //             code: 'przesz',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Pływanie',
        //             code: 'plyw',
        //             value3: null,
        //             value4: null,
        //             ability: 'S',
        //         },
        //         {
        //             name: 'Rzemiosło',
        //             code: 'rzemio',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Skakanie',
        //             code: 'skak',
        //             value3: null,
        //             value4: null,
        //             ability: 'S',
        //         },
        //         {
        //             name: 'Spostrzegawczość',
        //             code: 'spost',
        //             value3: 10,
        //             value4: 3,
        //             ability: 'RZT',
        //         },
        //         {
        //             name: 'Szacowanie',
        //             code: 'szac',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Sztuka Przetrwania',
        //             code: 'sztprz',
        //             value3: null,
        //             value4: null,
        //             ability: 'RZT',
        //         },
        //         {
        //             name: 'Ukrywanie się',
        //             code: 'ukryw',
        //             value3: 10,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Unieszkodliwianie Mechanizmów',
        //             code: 'uniesz',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Upadanie',
        //             code: 'upada',
        //             value3: null,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Używanie Liny',
        //             code: 'uzlin',
        //             value3: null,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Używanie Magicznych Urządzeń',
        //             code: 'uzmech',
        //             value3: null,
        //             value4: null,
        //             ability: 'CHA',
        //         },
        //         {
        //             name: 'Wiedza (Architektura i inynieria)',
        //             code: 'wiearch',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Wiedza (Geografia)',
        //             code: 'wiegeo',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Wiedza (Historia)',
        //             code: 'wiehis',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Wiedza (Plany)',
        //             code: 'wiepla',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Wiedza (Religia)',
        //             code: 'wierel',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Wiedza (Szlachta i władcy)',
        //             code: 'wieszla',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Wiedza (Tajemna)',
        //             code: 'wietaj',
        //             value3: null,
        //             value4: null,
        //             ability: 'INT',
        //         },
        //         {
        //             name: 'Wspinaczka',
        //             code: 'wspin',
        //             value3: null,
        //             value4: null,
        //             ability: 'S',
        //         },
        //         {
        //             name: 'Wyczucie Pobudek',
        //             code: 'wyczpo',
        //             value3: 15,
        //             value4: null,
        //             ability: 'RZT',
        //         },
        //         {
        //             name: 'Wyzwalanie się',
        //             code: 'wyzwal',
        //             value3: null,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Zachowanie Równowagi',
        //             code: 'zachr',
        //             value3: null,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //         {
        //             name: 'Zastraszanie',
        //             code: 'zastr',
        //             value3: null,
        //             value4: null,
        //             ability: 'CHA',
        //         },
        //         {
        //             name: 'Zbieranie Informacji',
        //             code: 'zbinfo',
        //             value3: null,
        //             value4: null,
        //             ability: 'CHA',
        //         },
        //         {
        //             name: 'Zręczna Dłoń',
        //             code: 'zredl',
        //             value3: null,
        //             value4: null,
        //             ability: 'ZR',
        //         },
        //     ]
        // })
    })

    app.get('/healthz', (req, res) => res.send('ok!'))
}