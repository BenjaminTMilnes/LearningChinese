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

class MultipleChoiceQuestionGenerator {
    constructor(){
        this.chineseParameterSets = [];
        this.chineseCorrectAnswer = "";
        this.chineseIncorrectAnswers = [];

        this.chineseRomanisationParameterSets = [];
        this.chineseRomanisationCorrectAnswer = "";
        this.chineseRomanisationIncorrectAnswers = [];

        this.englishParameterSets = [];
        this.englishCorrectAnswer = "";
        this.englishIncorrectAnswers = [];
    }

    applyParameters(text, parameters){   
        for (var i = 0; i < parameters.length; i++){
            var j = i + 1;
            text = text.replace("{" + j.toString() + "}", parameters[i]);
        }

        return text;
    }

    generateQuestion(language1 = "chinese", language2 = "english"){
        var parameterSetIndex = Math.round(Math.random() * (this.chineseParameterSets.length - 1));

        var question = new MultipleChoiceQuestion();

        if (language1 == "chinese"){
            question.text = this.applyParameters(this.chineseCorrectAnswer, this.chineseParameterSets[parameterSetIndex]);
        }
        else if (language1 == "chineseRomanisation"){
            question.text = this.applyParameters(this.chineseRomanisationCorrectAnswer, this.chineseRomanisationParameterSets[parameterSetIndex]);
        }
        else if (language1 == "english"){
            question.text = this.applyParameters(this.englishCorrectAnswer, this.englishParameterSets[parameterSetIndex]);
        }

        if (language2 == "chinese"){
            question.correctAnswer = this.applyParameters(this.chineseCorrectAnswer, this.chineseParameterSets[parameterSetIndex]);
            question.incorrectAnswers = this.chineseIncorrectAnswers.map(a => this.applyParameters(a, this.chineseParameterSets[parameterSetIndex]));
        }
        else if (language2 == "chineseRomanisation"){
            question.correctAnswer = this.applyParameters(this.chineseRomanisationCorrectAnswer, this.chineseRomanisationParameterSets[parameterSetIndex]);
            question.incorrectAnswers = this.chineseRomanisationIncorrectAnswers.map(a => this.applyParameters(a, this.chineseRomanisationParameterSets[parameterSetIndex]));
        }
        else if (language2 == "english"){
            question.correctAnswer = this.applyParameters(this.englishCorrectAnswer, this.englishParameterSets[parameterSetIndex]);
            question.incorrectAnswers = this.englishIncorrectAnswers.map(a => this.applyParameters(a, this.englishParameterSets[parameterSetIndex]));
        }

        return question;
    }
}

class QuestionGenerator1 extends MultipleChoiceQuestionGenerator {
    constructor(){
        this.chineseParameterSets = [["图书馆", "银行", "书店"], ["开门", "关门"]];
        this.chineseCorrectAnswer = "{1}几点{2}";
        this.chineseIncorrectAnswers = [];

        this.chineseRomanisationParameterSets = [];
        this.chineseRomanisationCorrectAnswer = "";
        this.chineseRomanisationIncorrectAnswers = [];

        this.englishParameterSets = [["library", "bank", "book shop"], ["open", "close"]];
        this.englishCorrectAnswer = "What time does the {1} {2}?";
        this.englishIncorrectAnswers = [
            "Where is the {1}?"
        ];
    }

}

application.controller("MainController", ["$scope", "$rootScope", "$routeParams", "$timeout", function MainController($scope, $rootScope, $routeParams, $timeout) {

    $scope.activityType = ""
    $scope.questionText = "";
    $scope.choices = [];
    $scope.showAnswers = false;

    $scope.a11 = new Audio("a1-1.mp3");
    $scope.a12 = new Audio("a1-2.mp3");

    $scope.newQuestion = function () {
        var words = content.lessons[0].activities[0].words;
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