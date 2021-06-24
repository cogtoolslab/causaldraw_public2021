function sendData(data) {
  console.log('sending data to mturk');
  jsPsych.turk.submitToTurk({
    'score': 0 //this is a dummy placeholder
  });
}

// Define trial object with boilerplate

var image_button_response_choices = [
  '<div class="intervention_buttons"><img id="pull_im" height="75px" src="stim/pull.png">Pull</div>', 
  '<div class="intervention_buttons"><img id="rotate_im" height="75px" src="stim/rotate.png">Rotate</div>', 
  '<div class="intervention_buttons"><img id="push_im" height="75px" src="stim/push.png">Push</div>', 
  "<div class='intervention_buttons' style='padding: 20px;'>I don't know</div>"
];

function Trial() {
  this.type = 'image-button-response',
  this.dbname = 'causaldraw';
  this.colname = 'intervention_2';
  this.iterationName = 'pilot1';
  this.stimulus = 'stim/gears_1_annotations_edited.png'; // dummy variable that plugin seems to need even if 'stimulus' param is removed
  this.stimulus_height = 500;
  this.choices = image_button_response_choices;
  this.prompt = "<p>What action is needed to operate the machine?</p>";
  this.response_ends_trial = true
};

function setupGame() {
  socket.on('onConnected', function(d) {

    // get MTURK workerId, etc. from URL (so that it can be sent to the server)
    var turkInfo = jsPsych.turk.turkInfo();

    // get PROLIFIC participantID
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var prolificID = urlParams.get('PROLIFIC_PID')   // ID unique to the participant
    var studyID = urlParams.get('STUDY_ID')          // ID unique to the study
    var sessionID = urlParams.get('SESSION_ID')      // ID unique to the particular submission

    // make flags to control which trial types are included in the experiment
    const includeIntro = true;
    const includeCollectUCSD = true;
    const includeQuiz = true;
    const includeExitSurvey = true;

    // recruitment platform
    const mTurk = false;

    // grab attributes of "d" that came back from server
    var meta = d.meta;
    var gameid = d.gameid;
    console.log('meta', meta);

    if (mTurk) {
      var recruitmentPlatform = 'mturk'
    } else {
      // IMPORTANT! Change to either SONA or PROLIFIC! 
      var recruitmentPlatform = 'sona'
    };

    console.log('recruiting on', recruitmentPlatform, '...');
    
    /////////////////////////////////////
    // at end of each trial save data locally and send data to server
    var main_on_finish = function(data) {
      socket.emit('currentData', data);
      console.log('emitting data');
    }

    // add additional default info so that experiment doesnt break without any stim uploaded
    var additionalInfo = {
      // add prolific info
      prolificID:  prolificID,
      studyID: studyID, 
      sessionID: sessionID,
      // add SONA info
      experiment_id: 1957,
      credit_token: '94edbf1cbf524148b93e396bc6194eae',
      // add usual info
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      wID: turkInfo.workerId, 
      hitID: turkInfo.hitId, 
      aID: turkInfo.assignmentId, 
      on_finish: main_on_finish
    }

    var SONA_specific_surveycode = jsPsych.data.getURLVariable('survey_code');
    // console.log('SONA surveycode', SONA_specific_surveycode);
    
    /////////////////////////////////////
    // create keyboard practice trials 
    var keyboard_practice0 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-button-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">0</div> \
      </div>',
      choices: ['0', '1', '2', '3'],
      prompt: "<br>Click the button that matches the number.",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    var keyboard_practice1 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-button-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">1</div> \
      </div>',
      choices: ['0', '1', '2', '3'],
      prompt: "<br>Click the button that matches the number.",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    var keyboard_practice2 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-button-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">2</div> \
      </div>',
      choices: ['0', '1', '2', '3'],
      prompt: "<br>Click the button that matches the number.",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    var keyboard_practice3 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-button-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">3</div> \
      </div>',
      choices: ['0', '1', '2', '3'],
      prompt: "<br>Click the button that matches the number.",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    /////////////////////////////////////
    // create image practice trials 
    var practice1 = _.extend({}, new Trial, additionalInfo,{
      type: 'image-button-response',  
      choices: image_button_response_choices,
      toy_id: 'bopit_2',
      sketch_id: 'bopit_drawing1.png',
      condition: 'practice_bopit',
      phase: 'practice', 
      batch: 'practice_bopit', 
      numTrials: '6', 
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      });

    var practice2 = _.extend({}, new Trial, additionalInfo,{
      type: 'image-button-response',  
      choices: image_button_response_choices,
      toy_id: 'bopit_4',
      sketch_id: 'bopit_drawing3.png',
      condition: 'practice_bopit',
      phase: 'practice', 
      batch: 'practice_bopit', 
      numTrials: '6', 
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      });

    var practice3 = _.extend({}, new Trial, additionalInfo,{
      type: 'image-button-response',  
      choices: image_button_response_choices,
      toy_id: 'bopit_3',
      sketch_id: 'bopit_drawing4.png',
      condition: 'practice_bopit',
      phase: 'practice', 
      batch: 'practice_bopit', 
      numTrials: '6', 
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      });

    /////////////////////////////////////

    //collect PID info from SONA participants
    var UCSD_info = _.omit(_.extend({}, new Trial, additionalInfo));
    var collectUCSD_info = _.extend({}, UCSD_info, {
      type: 'survey-text',
      questions: [{
          prompt: "<p>Please enter your email address below. <i>Note that it is important that you use the email \
          address that you use to sign up for SONA studies.</i> For some students, this is their UCSD email address. \
          <p>This will only be used to verify that you completed this study, so that you can be given credit on SONA. \
          Your email address will not be used for any other purpose. \
          Otherwise, it is difficult to assign credit because students are only identified by their email address, \
          first name, and last name.</p> \
          <p>Click 'Continue' to participate in this study.</p>",
          placeholder: "your email address",
          rows: 1,
          columns: 30,
          required: true
        }
      ],
      on_finish: main_on_finish
    });

    // count total trials
    var numTrials = meta.length;

    // generate and shuffle trials AND add trial numbers
    var trials = _.map(_.shuffle(meta), function(trial, i) {
      return _.extend({}, trial, new Trial, additionalInfo, {
        trialNum: i,
        numTrials: numTrials,
      })
    });

    /////////////////////////////////////
    // add instruction pages
    instructionsHTML = {
      // 'str1': "<p>Welcome! In this study, you will play a \
      // fun game where you will see some drawings and machines. Your task is to interpret the \
      // drawings to figure out how to operate each machine. Your total time commitment is expected to be \
      // 10 minutes, including the time it takes to read these instructions. \
      // For your participation in this study, you will receive $1.00 through Prolific.<p> \
      // <p>When you are finished, the study will be automatically submitted for approval. \
      // You can only perform this study one time.</p> \
      // <p><i>Note: We recommend using Chrome. This study has not been tested in other browsers.</i></p>",
      'str1': "<p>Welcome! In this study, you will play a \
      fun game where you will see drawings that depict some machines. Your task is to interpret the \
      drawings to figure out how to operate each machine. Your total time commitment is expected to be \
      ~15 minutes, including the time it takes to read these instructions. \
      For your participation in this study, you will receive 0.5 credits through SONA.<p> \
      <p>When you are finished, the study will be submitted for approval. \
      You can only perform this study one time.</p> \
      <p><i>Note: We recommend using Chrome. This study has not been tested in other browsers.</i></p>",
      'str2': ["<u><p>Instructions</p></u>",
      "<p>In this game, your task is to interpret a series of drawings to figure out how to \
      operate some machines.</p> \
      <p>During each trial, you will see a drawing that depicts a machine and a series of buttons below the drawing. \
      <b>Your task will be to figure out what action is needed to operate the machine based on your interpretation of the drawing.</b></p> \
      <p>Here's a screenshot of what a trial might look like: </p>\
      <div><img id='bopitDemo_still' height='400' src='stim/intro_image.png'></div><br>"].join(' '),
      'str3': ["<u><p>Instructions</p></u>",
      "<p>When you see the drawing, click the button that describes the action that is needed to operate the machine. \
      <b>Please be as accurate as you can!\
      Try to only click the 'I don't know' button if you truly cannot interpret the drawing.</b></p> \
      <p>Here is an example of what a trial might look like:</p> \
      <div><video id='bopitDemo_video' height='500' autoplay loop> <source src='stim/intro_video.mp4' type='video/mp4'></div> \
      <p>In this example, the correct answer is 'rotate'.</p>"].join(' '),
      // 'str4': ["<u><p>Instructions</p></u>",
      // "<p>To make sure that you'll be able to press a number on your keyboard as quickly as \
      // possible, you will be instructed to place your fingers on the numbers 1 and 0 and the spacebar on your keyboard before \
      // completing any test trials. Using your left hand, you can place your pointer finger on the number 1. \
      // Using your right hand, you can place your pointer finger on the number 0. You can also place your right \
      // thumb on the spacebar of your keyboard.</p> \
      // <p>Place your fingers on the numbers that lie horizontally across the top of your keyboard. \
      // Do not use the numeric keypad if your keyboard has one. Please keep your fingers on the numbers \
      // 1 and 0 and spacebar throughout all the test trials. There will be 6 trials.</p> \
      // <div><img id='keyboard_combined' class='introImgs' src='stim/keyboard_combined_2AFC.png'></div>"].join(' '), 
      // 'str5': ["<u><p>Instructions</p></u>",
      // "<p>Here is an example of what a trial might look like. Remember that you'll see the machine and drawing each for 3s \
      // before the reference image appears. Once you see the reference picture, you'll press the keyboard number that corresponds \
      // to the part of the machine that someone would move to operate it. You should try to respond with the correct keyboard number \
      // as quickly as you can. \
      // In this example, the correct answer is '0'.</p> \
      // <p>Please watch the short video below: </p> \
      // <div><video id='bopitDemo_video' height='500' autoplay loop> <source src='stim/bopit_demo.mp4' type='video/mp4'></div> \
      // <p><b>Remember that your task is to figure out how to operate the machine <i>based on your \
      // interpretation of the drawing</i>.</b> Some drawings may be better or worse than others, but you should \
      // do your best to interpret the drawing to make a response, rather than try to figure out how the machine \
      // functions without the drawing.</p>"].join(' '), 
      'str6': ["<u><p>Instructions</p></u>",
      "<p>Let's first check that our interface works on your computer! \
      Next you'll next complete some practice trials to check this. \
      In the next part of this game, you'll be presented with a series of numbers. Each time you see a number on your screen, \
      click the button that corresponds to it.</p> \
      <p>Click 'Next' to start the practice trials.</p>"].join(' '), 
      // 'str_keyPractice': "<p>To get ready for the practice trials, place your fingers on the keyboard numbers 1 and 0 and your thumb \
      // on the spacebar. \
      // Keep your fingers on these numbers until you finish the practice trials.</p> \
      // <p>When you are ready to complete the practice trials, press the 'spacebar' with your thumb, \
      // but do not move your fingers from the numbers on your keyboard.</p> \
      // <div><img id='keyboard_space' height='300' src='stim/keyboard_2AFC.png'></div>",
      'str_practice': "<p>Great! Now you'll complete 3 practice trials in which \
      you'll see drawings and use them to figure out how to operate some machines.</p> \
      <p>When you are ready to complete these next practice trials, click 'Next'.</p>",
      'str7': "<p>Well done! You've completed the practice trials. When you're ready, click 'Next' to complete a short quiz.</p>",
      // 'str8': "<p>Well done!</p> \
      // <p>In this next part of the study, you will see some drawings of different machines. <b>Your task is to figure out which part of the machine needs \
      // to be moved in order to turn on the light <i>based on your interpretation of the provided drawing</i>.</b> On each of the \
      // machines, there are 2 red components that are connected to 2 wires. When these red components touch and close the electrical \
      // circuit, the light bulb will turn on.</p> \
      // <p>Here is a video demonstration of how the lightbulb works:</p><video autoplay loop height='300'><source src='stim/fam_light.mp4'></video>\
      // <p>Once you determine which part of the machine needs to be moved to turn the light on, please make your response as quickly \
      // as you can. <b>However, accuracy is more important than speed</b>, so please do not rush to make a response before you are confident.</p>",
      'str_test': "<p>Well done! Now you're ready to start the test trials! Click 'Next' to complete the test trials.</p>"
    };

    // add consent pages
    consentHTML = {
      'str1': ["<u><p id='legal'>Consent to Participate</p></u>",
        "<p id='legal'>By completing this study, you are participating in a \
      study being performed by cognitive scientists in the UC San Diego \
      Department of Psychology. The purpose of this research is to find out \
      how people understand visual information. \
      You must be at least 18 years old to participate. There are neither \
      specific benefits nor anticipated risks associated with participation \
      in this study. Your participation in this study is completely voluntary\
      and you can withdraw at any time by simply exiting the study. You may \
      decline to answer any or all of the following questions. Choosing not \
      to participate or withdrawing will result in no penalty. Your anonymity \
      is assured; the researchers who have requested your participation will \
      not receive any personal information about you, and any information you \
      provide will not be shared in association with any personally identifying \
      information.</p>"
      ].join(' '),
      'str2': ["<u><p id='legal'>Consent to Participate</p></u>",
        "<p> If you have questions about this research, please contact the \
      researchers by sending an email to \
      <b><a href='mailto://cogtoolslab.requester@gmail.com'>cogtoolslab.requester@gmail.com</a></b>. \
      These researchers will do their best to communicate with you in a timely, \
      professional, and courteous manner. If you have questions regarding your \
      rights as a research subject, or if problems arise which you do not feel \
      you can discuss with the researchers, please contact the UC San Diego \
      Institutional Review Board.</p><p>Click 'Next' to continue \
      participating in this study.</p>"
      ].join(' ')
    };

    /////////////////////////////////////
    // combine instructions and consent
    var introMsg_0 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str1,
        consentHTML.str1,
        consentHTML.str2
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };

    var introMsg_1 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str2,
        instructionsHTML.str3,
        instructionsHTML.str6,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };
    
    var keyboardMsg_practice = {
      type: 'instructions',
      pages: [
        instructionsHTML.str_practice,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      allow_keys: true,
      delay: true,
      delayTime: 0, 
    };

    var introMsg_4 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str7,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 0,
    };
  
    
    var keyboardMsg_test = {
      type: 'instructions',
      pages: [
        instructionsHTML.str_test,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      allow_keys: true,
      delay: true,
      delayTime: 0, 
    };

    /////////////////////////////////////
    // add comprehension check
    var quizTrial = {
      type: 'survey-multi-choice',
      preamble: "<b><u>Quiz</u></b><p>Before completing the next part of this study, please complete the following quiz.</p>",
      questions: [{
          prompt: "<b>Question 1</b> \
          <br>During each trial, what should you do? ",
          name: 'whatToDoDO',
          horizontal: false,
          options: ["Based on the drawing, click the action needed to operate the machine", 
                    "Click on any button as quickly as you can", 
                    "I don't know"],
          required: true
        },
        {prompt: "<b>Question 2</b> \
          <br>When should you click on the 'I don't know' button? ",
          name: 'whatToClick',
          horizontal: false,
          options: ["Whenever you can to finish as quickly as you can", 
                    "Whenever you are not fully confident in your response"],
          required: true
        },
        {prompt: "<b>Question 3</b> \
        <br>What should you prioritize while completing trials of this study?",
        name: 'whatToPrioritze',
        horizontal: false,
        options: ["Accuracy", 
                  "Speed"],
        required: true
      },
        {
          prompt: "<b>Question 4</b> \
          <br>Can you do this study more than once?",
          name: "howManyTimesHIT",
          horizontal: false,
          options: ["Yes", 
                    "No"],
          required: true
        }
      ]
    };

    // Check whether comprehension check responses are correct
    var loopNode = {
      timeline: [quizTrial],
      loop_function: function(data) {
        resp = JSON.parse(data.values()[0]['responses']);
        if ((resp['whatToDoDO'] == 'Based on the drawing, click the action needed to operate the machine') &&
          (resp['whatToClick'] == 'Whenever you are not fully confident in your response') &&
          (resp['whatToPrioritze'] == 'Accuracy') &&
          (resp['howManyTimesHIT'] == 'No')) {
          return false;
        } else {
          alert('Try again! One or more of your responses was incorrect.');
          return true;
        }
      }
    };

    // add exit survey (multiple choice)
    var surveyChoiceInfo = _.omit(_.extend({}, new Trial, additionalInfo)); 
    var exitSurveyChoice = _.extend({}, surveyChoiceInfo, {
      type: 'survey-multi-choice',
      preamble: "<strong><u>Survey</u></strong>",
      questions: [{
          prompt: "What is your sex?",
          name: "participantSex",
          horizontal: true,
          options: ["Male", "Female", "Neither/Other/Do Not Wish To Say"],
          required: true
        },
        {
          prompt: "How difficult did you find this study? (1: very easy, 7: very hard)",
          name: "judgedDifficulty",
          horizontal: true,
          options: ["1", "2", "3", "4", "5", "6", "7"],
          required: true
        },
        {
          prompt: "Did you encounter any technical difficulties while completing this study? \
            This could include: images were glitchy (e.g., did not load, ability to click on keyboard \
            was glitchy, or sections of the study did not load properly.)",
          name: "technicalDifficultiesBinary",
          horizontal: true,
          options: ["Yes", "No"],
          required: true
        }
      ],
      on_finish: main_on_finish
    });
    
    // add exit survey (free response choice)
    var surveyTextInfo = _.omit(_.extend({}, new Trial, additionalInfo)); 
    var exitSurveyText = _.extend({}, surveyTextInfo, {
      type: 'survey-text',
      preamble: "<strong><u>Survey</u></strong>",
      questions: [{
          name: 'participantAge',
          prompt: "What is your year of birth?",
          placeholder: "e.g., 2020",
          require: true
        },
        {
          name: 'participantYears',
          prompt: "How many years ago are you?",
          placeholder: "e.g., 18",
          require: true
        },
        {
          name: "TechnicalDifficultiesFreeResp",
          prompt: "If you encountered any technical difficulties, please briefly describe the issue.",
          placeholder: "I did not encounter any technical difficulities.",
          rows: 5,
          columns: 50,
          required: true
        },
        {
          name: 'participantComments',
          prompt: "Thank you for participating in our study! Do you have any other comments or feedback \
            to share with us about your experience?",
          placeholder: "I had a lot of fun!",
          rows: 5,
          columns: 50,
          require: true
        }
      ],
      on_finish: main_on_finish
    });

    // add goodbye page
    var goodbye = {
      type: 'instructions',
      // pages: [
      //   "<p>Congrats! You are all done. Thanks for participating in our game! \
      //   Please click 'Next' to submit your data to Prolific!</p>"
      // ],
      pages: [
        "<p>Congrats! You are all done. Thanks for participating in our game!</p> \
        <p>Click 'NEXT' to submit this study to SONA. After you click 'Next', you will see a blank page on this web page \
        but will be redirected to the SONA homepage. \
        This means that your participation has been logged. \
        If you do not receive credit after immediately, please wait a few days. If you do not receive credit after 3 days, please email \
        <b><a href='mailto://cogtoolslab.requester@gmail.com'>cogtoolslab.requester@gmail.com</a></b></p>"
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: false,
      // on_start: function() {
      //   $(".confetti").addClass("showing");
      // },
      on_finish: function() {
        // $(".confetti").remove();
        sendData();
        // window.open("https://app.prolific.co/submissions/complete?cc=B99EB96E","_self")
        window.open('https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=1957&credit_token=94edbf1cbf524148b93e396bc6194eae&survey_code=' + jsPsych.data.getURLVariable('survey_code'))
      }
    };

    /////////////////////////////////////
    // add all experiment elements to trials array
    var setup = [];

    // add instructions before practice trials
    if (includeIntro) setup.push(introMsg_0);
    if (includeCollectUCSD) setup.push(collectUCSD_info);
    if (includeIntro) setup.push(introMsg_1);

    // skip to this during debugging 
    // var experiment = setup.concat(trials);

    //add practice number trials
    var keyboard_list = [
      keyboard_practice0,  
      keyboard_practice1, 
      keyboard_practice2, 
      keyboard_practice3
    ];
    keyboard_shuff = _.shuffle(keyboard_list);

    var keys = setup.concat(keyboard_shuff);

    keys.push(keyboardMsg_practice);

    // add practice drawing trials
    var practice_list = [
      practice1, 
      practice2, 
      practice3
    ];
    practice_shuff = _.shuffle(practice_list);
    var practice = keys.concat(practice_shuff);

    if (includeIntro) practice.push(introMsg_4);
    if (includeQuiz) practice.push(loopNode);

    // add test trials
    if (includeIntro) practice.push(keyboardMsg_test);
    var experiment = practice.concat(trials);

    // add exit info
    if (includeExitSurvey) experiment.push(exitSurveyChoice);
    if (includeExitSurvey) experiment.push(exitSurveyText);
    experiment.push(goodbye);

    console.log('experiment', experiment);

    // set up images for preload
    var imagePaths = [
      'data/run1/bopit_drawing1.png',
      'data/run1/bopit_drawing2.png',
      'data/run1/bopit_drawing3.png',
      'data/run1/bopit_drawing4.png',
      'data/run1/bopit_drawing5.png', 
      'stim/pull.png', 
      'stim/push.png', 
      'stim/rotate.png'
    ];

    // set up videos for preload
    var videoPaths = [
      'stim/intro_video.mp4',
      'stim/fam_light.mp4'
    ];

    jsPsych.init({
      timeline: experiment,
      default_iti: 1000,
      preload_images: imagePaths,
      preload_video: videoPaths,
      show_progress_bar: true
    });

  }); // close onConnected
} // close setup game