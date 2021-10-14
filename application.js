var application = angular.module("LearningChinese", ["ngRoute", "ngSanitize"]);

application.directive("compile", ["$compile", function ($compile) {
    return function (scope, element, attributes) {
        scope.$watch(function (scope) {
            return scope.$eval(attributes.compile);
        }, function (value) {
            element.html(value);
            $compile(element.contents())(scope);
        });
    };
}]);

var content = {
    "lessons": [
        {
            "activities": [
                {
                    "type": "multipleChoiceWords",
                    "words": [
                        {
                            "text": "开始",
                            "correctAnswer": "begin",
                            "incorrectAnswers": ["open", "close", "end", "prepare"]
                        },
                        {
                            "text": "上课",
                            "correctAnswer": "have classes",
                            "incorrectAnswers": ["begin", "end", "open", "close"]
                        },
                        {
                            "text": "开门",
                            "correctAnswer": "open",
                            "incorrectAnswers": ["begin", "end", "close", "prepare"]
                        },
                        {
                            "text": "关门",
                            "correctAnswer": "close",
                            "incorrectAnswers": ["begin", "end", "open", "prepare"]
                        },
                    ]
                },
                {
                    "type": "multipleChoiceSentences",
                    "sentences": [
                        {
                            "text": "几点了",
                            "correctAnswer": "What time is it?",
                            "incorrectAnswers": [
                                "What time was it?",
                                "How many are there?",
                                "How many were there?"
                            ]
                        },
                        {
                            "text": "现在几点了",
                            "correctAnswer": "What time is it?",
                            "incorrectAnswers": [
                                "What time was it?",
                                "How many are there?",
                                "How many were there?"
                                , "Where are we meeting?",
                                "Where is it?",
                                "Where was it?"]
                        },
                        {
                            "text": "现在几点",
                            "correctAnswer": "What time is it?",
                            "incorrectAnswers": [
                                "What time was it?",
                                "How many are there?",
                                "How many were there?"
                                , "Where are we meeting?",
                                "Where is it?",
                                "Where was it?"]
                        },
                        {
                            "text": "现在十点",
                            "correctAnswer": "It's ten o'clock.",
                            "incorrectAnswers": [
                                "It's eleven o'clock.",
                                "It's four o'clock.",
                                "They are here.",
                                "There are ten of them.",
                                "What time is it?"]
                        },
                        {
                            "text": "现在十一点",
                            "correctAnswer": "It's eleven o'clock.",
                            "incorrectAnswers": [
                                "It's ten o'clock.",
                                "It's twelve o'clock.",
                                "It's four o'clock.",
                                "They are here.",
                                "There are eleven of them.",
                                "What time is it?"]
                        },
                        {
                            "text": "图书馆几点开门",
                            "correctAnswer": "What time does the library open?",
                            "incorrectAnswers": [
                                "What time does the library close?",
                                "What time does the book shop open?",
                                "What time does the book shop close?",
                                "Where is the library?",
                                "Where is the book shop?",
                                "What time does the museum open?",
                                "What time does the museum close?"]
                        },
                        {
                            "text": "图书馆几点关门",
                            "correctAnswer": "What time does the library close?",
                            "incorrectAnswers": [
                                "What time does the library open?",
                                "What time does the book shop open?",
                                "What time does the book shop close?",
                                "Where is the library?",
                                "Where is the book shop?",
                                "What time does the museum open?",
                                "What time does the museum close?"]
                        },
                        {
                            "text": "银行几点开门",
                            "correctAnswer": "What time does the bank open?",
                            "incorrectAnswers": [
                                "What time does the bank close?",
                                "What time does the library open?",
                                "What time does the library close?",
                                "Where is the bank?",
                                "Where is the train station?",
                                "What time does the museum open?",
                                "What time does the museum close?"]
                        },
                        {
                            "text": "银行几点关门",
                            "correctAnswer": "What time does the bank close?",
                            "incorrectAnswers": [
                                "What time does the bank open?",
                                "What time does the library open?",
                                "What time does the library close?",
                                "Where is the bank?",
                                "Where is the train station?",
                                "What time does the museum open?",
                                "What time does the museum close?"]
                        },
                        {
                            "text": "书店几点开门",
                            "correctAnswer": "What time does the book shop open?",
                            "incorrectAnswers": [
                                "What time does the book shop close?",
                                "What time does the library open?",
                                "What time does the library close?",
                                "Where is the library?",
                                "Where is the book shop?",
                                "What time does the museum open?",
                                "What time does the museum close?"]
                        },
                        {
                            "text": "书店几点关门",
                            "correctAnswer": "What time does the book shop close?",
                            "incorrectAnswers": [
                                "What time does the book shop open?",
                                "What time does the library open?",
                                "What time does the library close?",
                                "Where is the library?",
                                "Where is the book shop?",
                                "What time does the museum open?",
                                "What time does the museum close?"]
                        },
                        {
                            "text": "",
                            "correctAnswer": "",
                            "incorrectAnswers": ["", "", ""]
                        },
                        {
                            "text": "",
                            "correctAnswer": "",
                            "incorrectAnswers": ["", "", ""]
                        },
                        {
                            "text": "",
                            "correctAnswer": "",
                            "incorrectAnswers": ["", "", ""]
                        },
                        {
                            "text": "",
                            "correctAnswer": "",
                            "incorrectAnswers": ["", "", ""]
                        },
                    ]
                }
            ]
        }
    ]
}

function randomise(array) {
    var i = array.length;
    var j = 0;

    while (i > 0) {
        j = Math.floor(Math.random() * i);
        i--;

        k = array[j];
        array[j] = array[i];
        array[i] = k;
    }

    return array;
}

application.controller("MainController", ["$scope", "$rootScope", "$routeParams", "$timeout", function MainController($scope, $rootScope, $routeParams, $timeout) {

    $scope.activityType = ""
    $scope.questionText = "";
    $scope.choices = [];
    $scope.showAnswers = false;

    $scope.a11 = new Audio("a1-1.mp3");
    $scope.a12 = new Audio("a1-2.mp3");

    $scope.newQuestion = function () {
        var words = content.lessons[0].activities[1].sentences;
        words = words.filter(w => w.text != "");

        var i = Math.round(Math.random() * (words.length - 1));
        var word = words[i];

        var choices = randomise(word.incorrectAnswers.map(a => {
            return {
                "text": a,
                "isCorrect": false,
                "class": "multiplechoice-choice-selectable"
            };
        })).slice(0, 3);

        choices.push({
            "text": word.correctAnswer,
            "isCorrect": true,
            "class": "multiplechoice-choice-selectable"
        });

        $scope.activityType = "multipleChoiceSentences"
        $scope.questionText = word.text;
        $scope.choices = randomise(choices);
    }

    $scope.choose = function (choice) {

        if (choice.isCorrect) {
            $scope.a11.play();
        }
        else {
            $scope.a12.play();
        }

        $scope.choices = $scope.choices.map(c => {
            var _class = "multiplechoice-choice-notselectable";

            if (c.isCorrect) {
                _class = "multiplechoice-choice-selected-correct";
            }

            if (c.text == choice.text && c.isCorrect == false) {
                _class = "multiplechoice-choice-selected-incorrect";
            }

            return {
                "text": c.text,
                "isCorrect": c.isCorrect,
                "class": _class
            }
        });

        $scope.$digest();

        $timeout(function () {
            $scope.newQuestion();
        }, 1200);

    }

    document.onkeydown = function (e) {
        if (e.code == "Digit1" && $scope.choices.length > 0) {
            $scope.choose($scope.choices[0]);
            e.preventDefault();
        }
        if (e.code == "Digit2" && $scope.choices.length > 1) {
            $scope.choose($scope.choices[1]);
            e.preventDefault();
        }
        if (e.code == "Digit3" && $scope.choices.length > 2) {
            $scope.choose($scope.choices[2]);
            e.preventDefault();
        }
        if (e.code == "Digit4" && $scope.choices.length > 3) {
            $scope.choose($scope.choices[3]);
            e.preventDefault();
        }
        if (e.code == "Digit5" && $scope.choices.length > 4) {
            $scope.choose($scope.choices[4]);
            e.preventDefault();
        }
    }

    $scope.newQuestion();

}]);