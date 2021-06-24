function sendData(data) {
  console.log('sending data to mturk');
  jsPsych.turk.submitToTurk({
    'score': 0 //this is a dummy placeholder
  });
}

// Define trial object with boilerplate
function Trial() {
  this.type = 'image-keyboard-response',
  this.dbname = 'causaldraw';
  this.colname = 'intervention';
  this.iterationName = 'debugging5';
  this.stimulus = 'stim/gears_1_annotations_edited.png'; // dummy variable that plugin seems to need even if 'stimulus' param is removed
  this.choices = ['1', '2', '3', '4'];
  this.response_ends_trial = true; 
};

function setupGame() {
  socket.on('onConnected', function(d) {

    // get workerId, etc. from URL (so that it can be sent to the server)
    var turkInfo = jsPsych.turk.turkInfo();

    // make flags to control which trial types are included in the experiment
    const includeIntro = true;
    const includeCollectUCSD = false;
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
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      wID: turkInfo.workerId, 
      hitID: turkInfo.hitId, 
      aID: turkInfo.assignmentId, 
      on_finish: main_on_finish
    }

    /////////////////////////////////////
    // create keyboard practice trials 
    var keyboard_practice1 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-keyboard-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">1</div> \
      </div> \
      <div><img class="keyboardImgs" src="stim/keyboard_darkHands.png"></div>',
      choices: ['1', '2', '3', '4'],
      prompt: "",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    var keyboard_practice2 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-keyboard-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">2</div> \
      </div> \
      <div><img class="keyboardImgs" src="stim/keyboard_darkHands.png"></div>',
      choices: ['1', '2', '3', '4'],
      prompt: "",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    var keyboard_practice3 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-keyboard-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">3</div> \
      </div> \
      <div><img class="keyboardImgs" src="stim/keyboard_darkHands.png"></div>',
      choices: ['1', '2', '3', '4'],
      prompt: "",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    var keyboard_practice4 = _.extend({}, new Trial, additionalInfo,{
      type: 'html-keyboard-response',
      stimulus: '<div class="stimuli"> \
      <div class="keyboard_practice">4</div> \
      </div> \
      <div><img class="keyboardImgs" src="stim/keyboard_darkHands.png"></div>',
      choices: ['1', '2', '3', '4'],
      prompt: "",
      response_ends_trial: true,
      recruitmentPlatform: recruitmentPlatform,
      on_finish: main_on_finish
    });

    /////////////////////////////////////
    // create image practice trials 
    var practice1 = _.extend({}, new Trial, additionalInfo,{
      type: 'image-keyboard-response',  
      toy_id: 'bopit',
      sketch_id: 'bopit_drawing1.png',
      condition: 'practice_bopit',
      phase: 'practice', 
      batch: 'practice_bopit', 
      numTrials: '6', 
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      });

    var practice2 = _.extend({}, new Trial, additionalInfo,{
      type: 'image-keyboard-response',  
      toy_id: 'bopit',
      sketch_id: 'bopit_drawing2.png',
      condition: 'practice_bopit',
      phase: 'practice', 
      batch: 'practice_bopit', 
      numTrials: '6', 
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      });

    var practice3 = _.extend({}, new Trial, additionalInfo,{
      type: 'image-keyboard-response',  
      toy_id: 'bopit',
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
      'str1': "<p>Welcome! In this SONA study, you will play a \
      fun game where you will see some drawings and machines. Your task is to interpret the \
      drawings to figure out how to operate each machine. Your total time commitment is expected to be \
      approximately 30 minutes, including the time it takes to read these instructions. \
      For your participation in this study, you will receive 0.5 credit through SONA.<p> \
      <p>When you are finished, the study will be automatically submitted for approval. \
      You can only perform this study one time.</p> \
      <p><i>Note: We recommend using Chrome. This study has not been tested in other browsers.</i></p>",
      'str2': ["<u><p>Instructions</p></u>",
      "<p>In this game, your task is to interpret drawings to figure out how to \
      operate some machines.</p> \
      <p>During each trial, you will first see a drawing. After 5 seconds, the drawing will disappear \
      and then you will see a picture of the machine that the drawing represents. After 10 \
      seconds, the picture will disappear and then you will see a 'reference' picture. This reference \
      picture will be color-coded and numbered by the different parts of the machine.</p> \
      <div><img id='bopitDemo_still' class='introImgs' src='stim/bopitDemo_still.png'></div>"].join(' '),
      'str3': ["<u><p>Instructions</p></u>",
      "<p>When you see the reference picture, press the number on your keyboard \
      that corresponds to the part of the machine that someone would move to operate the machine \
      <i>based on your interpretation of the sketch.</i> <b>Your task is to do this as <i>quickly</i> and \
      <i>accurately</i> as you can.</b></p><p>While you should respond as quickly as you can, <b>please prioritize being accurate.</b></p> \
      <div><img id='bopit_intro' height='500' src='stim/bopit_intro.png'></div>"].join(' '),
      'str4': ["<u><p>Instructions</p></u>",
      "<p>To make sure that you'll be able to press a number on your keyboard as quickly as \
      possible, you will be instructed to place your fingers on the numbers 1-4 on your keyboard before \
      completing any test trials. Using your left hand, you can place your middle finger on the number 1 and pointer finger on the number 2. \
      Using your right hand, you can place your pointer finger on the number 3 and middle finger on the number 4.</p> \
      <p>Place your fingers on the numbers that lie horizontally across the top of your keyboard. \
      Do not use the numeric keypad if your keyboard has one. Please keep your fingers on the numbers \
      1-4 throughout all the test trials. There will be 6 trials.</p> \
      <div><img id='keyboard_combined' class='introImgs' src='stim/keyboard_combined.png'></div>"].join(' '), 
      'str5': ["<u><p>Instructions</p></u>",
      "<p>Here is an example of what a trial might look like. In this example, the correct answer \
      is '4'.</p> \
      <div><video height='500' autoplay loop> <source src='stim/bopitDemo.mp4' type='video/mp4'></div> \
      <p>Remember that your task is to figure out how to operate the machine <i>based on your \
      interpretation of the drawing</i>. Some drawings may be better or worse than others, but you should \
      do your best to interpret the drawing to make a response, rather than try to figure out how the machine \
      functions without the drawing.</p>"].join(' '), 
      'str6': ["<u><p>Instructions</p></u>",
      "<p>To check that our interface works on your computer and keyboard, you'll next complete some practice trials. \
      In the next part of this game, you'll be presented with a series of numbers. Each time you see a number on your screen, \
      press the number on your keyboard that matches it.</p> \
      <p>Below is an example of a practice trial. In this example, you would press the number '3' on your keyboard.</p> \
      <div><img id='number_demo' height='500' src='stim/number_demo.png'></div>"].join(' '), 
      'str_keyPractice': "<p>To get ready for the practice trials, place your fingers on the keyboard numbers 1-4. \
      Keep your fingers on these numbers until you finish the practice trials.</p> \
      <p>When you are ready to complete the practice trials, press the 'spacebar' with your thumb, \
      but do not move your fingers from the numbers on your keyboard.</p> \
      <div><img id='keyboard_space' height='300' src='stim/keyboard_space.png'></div>",
      'str_practice': "<p>Great! Keep your fingers where they are right now! Now you'll complete 3 practice trials in which \
      you'll see drawings and use them to figure out how to operate some machines.</p> \
      <p>When you are ready to complete these next practice trials, press the 'spacebar' with your thumb, \
      but do not move your fingers from the numbers on your keyboard.</p> \
      <div><img id='keyboard_space' height='300' src='stim/keyboard_space.png'></div>",
      'str7': "<p>Well done! You've completed the practice trials. When you're ready, click 'Next' to complete a short quiz.</p>",
      'str8': "<p>Well done!</p> \
      <p>In this next part of the study, you will see some machines. <b>Your task is to figure out which part of the machine needs to be \
      moved in order to turn on the light <i>based on your interpretation of the provided drawing</i>.</b> On each machine, \
      there are 2 red components that are connected to 2 wires. When these components are connected together, the light bulb attached to the machine will turn on.</p> \
      <p>Here is a video demonstration of how the lightbulb works:</p><video autoplay loop height='300'><source src='stim/fam_light.mp4'></video>\
      <p>Once you determine which part activates the light, please make your response as quickly as you can. <b>However, accuracy is more \
      important than speed</b>, so please do not rush to make a response before you are confident.</p> \
      <p>In the test trials, you will see images of the machines (not videos). Remember that some drawings may be better or worse than others, \
      but your task is to <i>interpret</i> them in order to figure out how operate the machines to turn the light on.</p>",
      'str_test': "<p>Now you're ready to start the test trials!</p> \
      <p>Please place your fingers on the keyboard numbers 1-4. Keep your fingers on these numbers until \
      you finish the 6 test trials.</p> \
      <p>When you are ready to complete the test trials, press the 'spacebar' with your thumb, \
      but do not move your fingers from the numbers on your keyboard.</p> \
      <div><img id='keyboard_space' height='300' src='stim/keyboard_space.png'></div>",
    };

    // add consent pages
    consentHTML = {
      'str1': ["<u><p id='legal'>Consent to Participate</p></u>",
        "<p id='legal'>By completing this SONA study, you are participating in a \
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
        instructionsHTML.str4,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };

    var introMsg_2 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str5,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 11000,
    };

    var introMsg_3 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str6,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };
    
    var keyboardMsg_keyPractice = {
      type: 'instructions',
      pages: [
        instructionsHTML.str_keyPractice,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      allow_keys: true,
      delay: true,
      delayTime: 200000, // note: when show_clickable_nav = false, plugin shows 'undefined', so decided to just delay this by 2min
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
      delayTime: 200000, // note: when show_clickable_nav = false, plugin shows 'undefined', so decided to just delay this by 2min
    };

    var introMsg_4 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str7,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };

    var introMsg_5 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str8,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
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
      delayTime: 200000, // note: when show_clickable_nav = false, plugin shows 'undefined', so decided to just delay this by 2min
    };

    /////////////////////////////////////
    // add comprehension check
    var quizTrial = {
      type: 'survey-multi-choice',
      preamble: "<b><u>Quiz</u></b><p>Before completing the next part of this study, please complete the following quiz.</p>",
      questions: [{
          prompt: "<b>Question 1</b> \
          <br>During each trial, you should: ",
          name: 'whatToDoDO',
          horizontal: false,
          options: ["Keep your fingers on the letters a-k", 
                    "Keep your fingers on the numbers 1-4", 
                    "I don't know"],
          required: true
        },
        {prompt: "<b>Question 2</b> \
          <br>When you see the reference picture, you should press a number on your keyboard as <i>quickly</i> and as <i>accurately</i> as possible. But you should make sure that you: ",
          name: 'whatToClick',
          horizontal: false,
          options: ["Prioritize accuracy", 
                    "Prioritize speed"],
          required: true
        },
        {
          prompt: "<b>Question 2</b> \
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
        if ((resp['whatToDoDO'] == 'Keep your fingers on the numbers 1-4') &&
          (resp['whatToClick'] == 'Prioritize accuracy') &&
          (resp['howManyTimesHIT'] == 'No')) {
          return false;
        } else {
          alert('Try again! One or more of your responses was incorrect.');
          return true;
        }
      }
    };

    // add exit survey (multiple choice)
    var surveyChoiceInfo = _.omit(_.extend({}, new Trial, additionalInfo)); //new Trial,
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
        // {
        //   prompt: "What device type did you use?",
        //   name: "deviceType",
        //   horizontal: true,
        //   options: ["Track Pad", "Mouse", "Other"],
        //   required: true
        // },
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
    var surveyTextInfo = _.omit(_.extend({}, new Trial, additionalInfo)); // new Trial,
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
      pages: [
        "<p>Congrats! You are all done. Thanks for participating in our game!</p> \
        <p>Click 'NEXT' to submit this study to SONA. After you click 'Next', you will see a blank page. \
        This means that your participation has been logged. \
        Our researchers will assign your participation credit within ~7 days. \
        If you do not receive credit after that period of time, please email \
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
      }
    };

    /////////////////////////////////////
    // add all experiment elements to trials array
    var setup = [];

    // add instructions before practice trials
    if (includeIntro) setup.push(introMsg_0);
    if (includeCollectUCSD) setup.push(collectUCSD_info);
    if (includeIntro) setup.push(introMsg_1);
    if (includeIntro) setup.push(introMsg_2);
    if (includeIntro) setup.push(introMsg_3);

    // var experiment = setup.concat(trials);

    setup.push(keyboardMsg_keyPractice);

    // add practice trials for keyboard presses
    var keyboard_list = [keyboard_practice1, 
      keyboard_practice2, 
      keyboard_practice3, 
      keyboard_practice4,  
      keyboard_practice1, 
      keyboard_practice2, 
      keyboard_practice3, 
      keyboard_practice4,
      keyboard_practice1, 
      keyboard_practice2, 
      keyboard_practice3, 
      keyboard_practice4
    ];
    keyboard_shuff = _.shuffle(keyboard_list);

    var keys = setup.concat(keyboard_shuff);

    keys.push(keyboardMsg_practice);

    // add practice trials
    var practice_list = [practice1, 
      practice2, practice3];
    practice_shuff = _.shuffle(practice_list);
    var practice = keys.concat(practice_shuff);

    if (includeIntro) practice.push(introMsg_4);
    if (includeQuiz) practice.push(loopNode);

    // add test trials
    if (includeIntro) practice.push(introMsg_5);
    if (includeIntro) practice.push(keyboardMsg_test);
    var experiment = practice.concat(trials);

    // // add exit info
    if (includeExitSurvey) experiment.push(exitSurveyChoice);
    if (includeExitSurvey) experiment.push(exitSurveyText);
    experiment.push(goodbye);

    console.log('experiment', experiment);

    // set up images for preload
    var imagePaths =
      ['stim/gears_1_small.png',
      'stim/gears_2_small.png',
      'stim/levers_1_small.png',
      'stim/levers_2_small.png',
      'stim/pulleys_1_small.png',
      'stim/pulleys_2_small.png',
      'stim/gears_1_annotations_reduced.png',
      'stim/gears_2_annotations_reduced.png',
      'stim/levers_1_annotations_reduced.png',
      'stim/levers_2_annotations_reduced.png',
      'stim/pulleys_1_annotations_reduced.png',
      'stim/pulleys_2_annotations_reduced.png', 
      'stim/bopitDemo_still.png',
      'stim/bopit_intro.png',
      'stim/bopit_annotations_reduced.png', 
      'stim/number_demo.png',
      'stim/keyboard_combined.png',
      'stim/keyboard_darkHands.png',
      'data/run1/bopit_drawing1.png',
      'data/run1/bopit_drawing2.png',
      'data/run1/bopit_drawing3.png',
      'data/run1/bopit_drawing4.png'
    ];

    // set up videos for preload
    var videoPaths = [
      'stim/bopitDemo.mp4',
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