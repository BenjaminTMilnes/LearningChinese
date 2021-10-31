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

function chooseRandom(array){
    var i = Math.round(Math.random() * (array.length - 1));

    return array[i];
}

class MultipleChoiceQuestion {
    constructor(){
        this.text = "";
        this.correctAnswer = "";
        this.incorrectAnswers = [];
    }

    getSetOfChoices(maximumNumberOfChoices = 5){
        if (maximumNumberOfChoices < 2){
            maximumNumberOfChoices = 2;
        }

        choices = randomise(this.incorrectAnswers.map(a => {return {
            "text":a,
            "isCorrect": false 
        }})).slice(maximumNumberOfChoices - 1);

        choices.push({
            "text": this.correctAnswer,
            "isCorrect": true
        });

        return choices;
    }
}

class Lesson {
    constructor(){
        this.title = "";
        this.activities = [];
    }

    static fromObject (o){
        var lesson = new Lesson();

        lesson.title = o.title;

        o.activities.forEach(a => {
            if (a.type == "letters" || a.type == "inputTextWords" || a.type == "syllables"){
                lesson.activities.push(LettersActivity.fromObject(a));
            }
        });

        return lesson;
    }
}

class Activity {
    constructor(type){
        this.type = type;
    }
}

class LettersActivity extends Activity {
    constructor(){
        super("letters");

        this.letters = [];
    }

    static fromObject(o){
        var activity = new LettersActivity();

        o.letters.forEach(l => {
            if (l.text != "" && l.correctAnswers.filter(ca => ca != "").length > 0){
            activity.letters.push(InputTextQuestion.fromObject(l));
            }
        });

        return activity;
    }

    getRandomQuestion(){
        return chooseRandom(this.letters);
    }


}

class Question {
    constructor(){
        this.text = "";
    }
}

class InputTextQuestion extends Question {
    constructor(){
        super();

        this.correctAnswers = [];
    }

    static fromObject(o){
        var question = new InputTextQuestion();

        question.text = o.text;
        question.correctAnswers = o.correctAnswers.filter(ca => ca != "");

        return question;
    }

    isCorrectAnswer(answer){
        return this.correctAnswers.filter(ca => ca == answer).length > 0;
    }
}

application.controller("MainController", ["$scope", "$rootScope", "$routeParams", "$http", "$timeout", function MainController($scope, $rootScope, $routeParams, $http, $timeout) {

    $scope.lesson = null;
    $scope.activity = null;
    $scope.question = null;
    $scope.studentAnswer = {};

    $scope.questionText = "";
    $scope.choices = [];
    $scope.showAnswers = false;

    $scope.a11 = new Audio("a1-1.mp3");
    $scope.a12 = new Audio("a1-2.mp3");

    $scope.newQuestion = function () {
        $scope.question = $scope.activity.getRandomQuestion();
        $scope.activityType = "letters";
        
      /*  var words = content.lessons[0].activities[0].words;
        words = words.filter(w => w.text != "" && w.correctAnswer != "" && w.incorrectAnswers.filter(a => a != "").length > 0);

        var i = Math.round(Math.random() * (words.length - 1));
        var word = words[i];

        var choices = randomise(word.incorrectAnswers.filter(a => a != "").map(a => {
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

        $scope.activityType = "multipleChoiceWords"
        $scope.questionText = word.text;
        $scope.choices = randomise(choices);*/
    }

    $scope.checkAnswer = function(){
        if ( $scope.question.isCorrectAnswer($scope.studentAnswer.text)){
            $scope.a11.play();
        }
        else {
            $scope.a12.play();           

        }


        $timeout(function () {
            $scope.studentAnswer.text = "";
            $scope.newQuestion();
        }, 1200);
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

    $scope.keyDown = function (e) {
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
        if (e.code == "Enter") {
            $scope.checkAnswer();
            e.preventDefault();
        }
    }

    $http.get("japanese-hiragana-part-1.lesson.json?x=" + Date.now().toFixed(0)).then(function(response){
        $scope.lesson = Lesson.fromObject(response.data);
$scope.activity = $scope.lesson.activities[0];

console.log($scope.lesson);

        
    $scope.newQuestion();
    });


}]);