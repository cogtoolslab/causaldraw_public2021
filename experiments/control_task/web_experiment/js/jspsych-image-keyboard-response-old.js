/**
 * jspsych-image-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 * hijacked by Holly Huey for causaldraw_intervention to:
 * display multiple images (sketch, machine stimulus, and segemented reference image)
 * 
 * IMPORTANT NOTE: This plugin allows 4 ROI responses. This is buggy! This was an attempt to allow participants to make multiple responses (which would be pushed to an array)
 **/


jsPsych.plugins["image-keyboard-response"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-keyboard-response', 'stimulus', 'image');

  plugin.info = {
    name: 'image-keyboard-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      }
    } // close params
  } // close plugin.info

  plugin.trial = function(display_element, trial) {

    // construct navigation path to PNGs
    trial.sketch_nav = 'data/run1/' + trial.sketch_id;
    console.log(trial.sketch_nav);
    trial.reference = 'stim/' + trial.toy_id + '_annotations_reduced.png';
    trial.machine = 'stim/' + trial.toy_id + '_small.png';

    console.log('trial', trial);

    /////////////////////////////////////
    var html = '';

    // add container for text and columns
    html += '<div id="container">'

    // add conditional trial counter 
    if (trial.phase == "practice") {
      html += '<div id="trialNum" style="color: white;"> ' + (trial.trialNum + 1) + " / " + trial.numTrials + '</div>';
    } // hide practice trialNum
    else if (trial.phase == "intervention") {
      html += '<div id="trialNum" style="color: black;"> ' + (trial.trialNum + 1) + " / " + trial.numTrials + '</div>';
    };

    // add row 1 for instructions
    html += '<div class="row">'
    html += '<div id="instructionsContainer">'
    html += '<div id="segmentInstructions" class="instructions">'
    html += '<p>Keep your fingers on the keyboard numbers 1-4.</p>'
    html += '</div>' // close instructions

    // add conditional prompt
    if (trial.phase == "practice") {
      html += '<div id="prompt" class="instructions">'
      html += '<p>Which part should someone move to operate the machine?<p>'
      html += '</div>' // close instructions
    } // switch prompt text
    else if (trial.phase == "intervention") {
      html += '<div id="prompt" class="instructions">'
      html += '<p>Which part of the machine needs to be moved turn the light on?<p>'
      html += '</div>' // close instructions
    };
    
    html += '</div>' // close instructionsContainer
    html += '</div>' // close row

    // add row 2 for stimuli
    html += '<div class="row">'

    // add column 1 for machine image
    html += '<div id="sketchContainer">'
    html += '<div id="machine-container">'
    html += '<img id="machine" class="stimuli" src="' + trial.machine + '">';
    html += '</div>' // close machine-container

    html += '<div id="reference-container">'
    html += '<img id="reference" class="stimuli" src="' + trial.reference + '">';
    html += '</div>' // close reference-container

    html += '<img id="jspsych-image-keyboard-response-stimulus" class="stimuli" src="' + trial.sketch_nav + '">';
    html += '</div>' // close sketchContainer
    html += '</div>' // close row of sketch column

    // add row 3 for schematic hands image
    html += '<div class="row">'
    html += '<div id="hands-container">'
    html += '<img id="hands" class="keyboardImgs_test" src="stim/keyboard_darkHands.png">';
    html += '</div>' // close reference-container
    html += '</div>'

    html += '</div>' //close container of text and columns

    // render
    display_element.innerHTML = html;

    /////////////////////////////////////
    // set global variables
    var turkInfo = jsPsych.turk.turkInfo();   

    // timestamp start of trial
    start_trial = Date.now();

    setTimeout(function() {
      $('#jspsych-image-keyboard-response-stimulus').hide();
      showMachine();
    }, 1000); // close setTimeout — show sketch for 5s //5000

    function showMachine() {
      $('#machine').show();

      setTimeout(function() {
        showAnnotation();
      }, 1000) //5000
    }; // close showMachine – show orig machine image for 5s

    function showAnnotation() {
      $('#machine').hide();
      $('#reference').show();
      
      // switch instructions text
      $('#segmentInstructions').hide();
      $('#prompt').show();

      // start timer when participant see annotation image
      start_rt_timer = Date.now();

      responseWindow();
    }; // close showAnnotation

    // store response
    var response = {
      rt: null,
      key: null
    };

    let correct_key = null;

    // make arrays for collected data
    let keyboardPresses = [];
    let keyboardRTs = [];

    var responseWindow = function() {

      console.log(trial.toy_id, 'toy_id before repsonse');

      document.addEventListener("keydown", function(event){
        keyboardPresses.push(event.key);
        response.key = event.key;

        keyboardRTs.push(event.timeStamp);
        response.rt = event.timeStamp;

        console.log(trial.toy_id, 'toy_id at response');

        // console.log(response.key);
        // console.log(response.rt);

        after_response();
        }, false); // close keydown function
      }; // close responseWindow function    

    // function to handle responses by the subject
    var after_response = function() {

      console.log(trial.toy_id, 'toy_id after response');

      if (trial.toy_id == 'gears_1') {
        correct_key = 4
      } else if (trial.toy_id == 'gears_2') {
        correct_key = 3
      } else if (trial.toy_id == 'levers_1') {
        correct_key = 2
      } else if (trial.toy_id == 'levers_2') {
        correct_key = 2 
      } else if (trial.toy_id == 'pulleys_1') {
        correct_key = 1
      } else if (trial.toy_id == 'pulleys_2') {
        correct_key = 1
      };

      console.log(correct_key, 'correct key');

      // if (response.key == trial.corrKey) {
      if (response.key == correct_key) {
        end_trial();
      } 
    }; // close after_response

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = _.extend({}, trial, {
        // rt: response.rt,
        machine: trial.machine,
        key_press: keyboardPresses, 
        key_rt: keyboardRTs, 
        wID: turkInfo.workerId, 
        hitID: turkInfo.hitId, 
        aID: turkInfo.assignmentId, 
        eventType: 'intervention',
        timeSketchPresented: start_rt_timer, 
        timeTrialStarted: start_trial
      });

      console.log('currentData', trial_data);
      // socket.emit('currentData', trial_data);

      // clear the display
      display_element.innerHTML = '';

      // reset to prevent double firing
      keyboardPresses = [];
      keyboardRTs = [];
      response = {
        rt: null,
        key: null
      };
      correct_key = null;

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    }; // close end_trial

  }; // close plugin.trial function

  return plugin;
})(); // close entire plugin