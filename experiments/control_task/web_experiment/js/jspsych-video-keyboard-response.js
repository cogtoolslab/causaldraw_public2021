/**
 * jspsych-image-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 * hijacked by Holly Huey for causaldraw_intervention to:
 * display videos and images (machine stimulus, and segemented reference image)
 * 
 * IMPORTANT NOTE: This plugin has been further modified to combined video stimuli from the orig causaldraw 
 * (code grabbed from the jspsych-cued-drawing.js plugin)
 **/


jsPsych.plugins["video-keyboard-response"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('video-keyboard-response', 'stimulus', 'image');

  plugin.info = {
    name: 'video-keyboard-response',
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
      },
      // prompt: {
      //   type: jsPsych.plugins.parameterType.STRING,
      //   pretty_name: 'Prompt',
      //   default: null,
      //   description: 'Any content here will be displayed below the stimulus.'
      // },
      // stimulus_duration: {
      //   type: jsPsych.plugins.parameterType.INT,
      //   pretty_name: 'Stimulus duration',
      //   default: null,
      //   description: 'How long to hide the stimulus.'
      // },
      // trial_duration: {
      //   type: jsPsych.plugins.parameterType.INT,
      //   pretty_name: 'Trial duration',
      //   default: null,
      //   description: 'How long to show trial before it ends.'
      // },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
    } // close params
  } // close plugin.info

  plugin.trial = function(display_element, trial) {

    // construct navigation path to PNGs
    // trial.sketch_nav = 'data/run1/' + trial.sketch_id;
    // console.log(trial.sketch_nav);

    trial.toy_id = trial.toy_type + '_' + trial.toy_variant;
    trial.reference = 'stim/' + trial.toy_id + '_annotations_reduced.png';
    // trial.machine = 'stim/' + trial.toy_id + '_small.png';

    // trial.phase = 'intervention';

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
      html += '<p>Which part should someone grab to operate the artifact?<p>'
      html += '</div>' // close instructions
    } // switch prompt text
    else if (trial.phase == "intervention") {
      html += '<div id="prompt" class="instructions">'
      html += '<p>Which part of the artifact needs to be moved turn the light on?<p>'
      html += '</div>' // close instructions
    };
    
    html += '</div>' // close instructionsContainer
    html += '</div>' // close row

    // add row 2 for stimuli
    html += '<div class="row">'

    // add column 1 for machine image
    html += '<div id="sketchContainer">'
    // html += '<div id="machine-container">'
    // html += '<img id="machine" class="stimuli" src="' + trial.machine + '">';
    // html += '</div>' // close machine-container

    html += '<div id="reference-container">'
    html += '<img id="reference" class="stimuli" src="' + trial.reference + '">';
    html += '</div>' // close reference-container

    html += '<video autoplay id="video_cue" class="stimuli"><source src="' + trial.stim_url + '" type="video/mp4" id="cue_html">';
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

    // var start_trial, start_rt_timer, keyboard_response, rt;

    // timestamp start of trial
    start_trial = Date.now();

    // Add event listener to 'video_cue': run function 'showMachine' after the VIDEO cue is done playing
    jsPsych.pluginAPI.setTimeout(function () {
      document.getElementById('video_cue').addEventListener('ended', showAnnotation, false);
    });

    function showAnnotation() {
      $('#video_cue').hide();
      $('#reference').show();
      
      // switch instructions text
      $('#segmentInstructions').hide();
      $('#prompt').show();

      // start timer when participant see annotation image
      start_rt_timer = Date.now();

      if (trial.choices != jsPsych.NO_KEYS) {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
      } // close if statement
    }; // close showAnnotation

    // store response
    var response = {
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      keyboard_response = Date.now();
      rt = keyboard_response - start_rt_timer; 

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = _.extend({}, trial, {
        rt: rt,
        timeVideoPresented: start_trial,
        timeROIPresented: start_rt_timer,
        keyboard_response: keyboard_response,
        stim_url: trial.stim_url,
        // machine: trial.machine,
        key_press: selected_roi,
        wID: turkInfo.workerId, 
        hitID: turkInfo.hitId, 
        aID: turkInfo.assignmentId, 
        eventType: 'intervention'
      });

      console.log('currentData', trial_data);
      // socket.emit('currentData', trial_data);

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      display_element.innerHTML = "<p>Fetching another artifact for you!";
      jsPsych.finishTrial(trial_data);
    }; // close end_trial

    // function to handle responses by the subject
    var after_response = function(info) {

      // only record the first response
      if (response.key == null) {
        response = info;
      }; 

      // convert keycodes of pressed keyboardNums into ROIs
      if (response.key == 49) {
        selected_roi = 1
      } else if (response.key == 50) {
        selected_roi = 2
      } else if (response.key == 51) {
        selected_roi = 3
      } else if (response.key == 52) {
        selected_roi = 4
      } else if (response.key == 53) {
      };

      if (trial.response_ends_trial) {
        end_trial();
      } // close if statement
    }; // close after_response

  }; // close plugin.trial function

  return plugin;
})(); // close entire plugin