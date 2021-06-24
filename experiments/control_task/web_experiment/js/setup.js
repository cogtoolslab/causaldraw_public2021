/**
 * IMPORTANT NOTE: This plugin was generated to check whether participants could understand how the machines 
 * function based on their viewing the original causaldraw videos. 
 * There are NO sketches in this task. 
 **/



function sendData(data) {
  console.log('sending data to mturk');
  jsPsych.turk.submitToTurk({
    'score': 0 //this is a dummy placeholder
  });
}

// Define trial object with boilerplate
function Trial() {
  this.type = 'video-keyboard-response',
  this.dbname = 'causaldraw';
  this.colname = 'intervention';
  this.iterationName = 'sanitycheck3';
  this.stimulus = 'stim/gears_1_annotations_edited.png'; // dummy variable that plugin seems to need even if 'stimulus' param is removed
  this.choices = ['1', '2', '3', '4'];
  // this.advance = [' '];
  this.phase = 'intervention';
  this.response_ends_trial = true
};

function setupGame() {
  socket.on('onConnected', function(d) {

    // get workerId, etc. from URL (so that it can be sent to the server)
    var turkInfo = jsPsych.turk.turkInfo();

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
      type: 'video-keyboard-response',  
      // toy_id: 'practice_bopit',
      toy_type: 'tongs',
      toy_variant: 'practice',
      stim_url: 'stim/tongs.mp4',
      // sketch_id: 'bopit_drawing1.png',
      condition: 'practice_tongs',
      phase: 'practice', 
      // batch: 'practice_bopit', 
      numTrials: '6', 
      gameID: gameid,
      recruitmentPlatform: recruitmentPlatform,
      });

    // var practice2 = _.extend({}, new Trial, additionalInfo,{
    //   type: 'image-keyboard-response',  
    //   toy_id: 'bopit',
    //   sketch_id: 'bopit_drawing2.png',
    //   condition: 'practice_bopit',
    //   phase: 'practice', 
    //   batch: 'practice_bopit', 
    //   numTrials: '6', 
    //   gameID: gameid,
    //   recruitmentPlatform: recruitmentPlatform,
    //   });

    // var practice3 = _.extend({}, new Trial, additionalInfo,{
    //   type: 'image-keyboard-response',  
    //   toy_id: 'bopit',
    //   sketch_id: 'bopit_drawing4.png',
    //   condition: 'practice_bopit',
    //   phase: 'practice', 
    //   batch: 'practice_bopit', 
    //   numTrials: '6', 
    //   gameID: gameid,
    //   recruitmentPlatform: recruitmentPlatform,
    //   });

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
      fun game where you will see video demonstrations of some mechanical artifacts to figure out how each \
      one functions. Your total time commitment is expected to be \
      approximately 30 minutes, including the time it takes to read these instructions. \
      For your participation in this study, you will receive 0.5 credit through SONA.<p> \
      <p>When you are finished, the study will be automatically submitted for approval. \
      You can only perform this study one time.</p> \
      <p><i>Note: We recommend using Chrome. This study has not been tested in other browsers.</i></p>",
      'str2': ["<u><p>Instructions</p></u>",
      "<p>In this game, you and a friend have discovered some mysterious artifacts while on a space expedition. \
      You hope to sell these artifacts to an alien who you will visit along your expedition, \
      but need to show it how each artifact functions before it will accept your sale.</p>\
      <p>Let's learn a bit about this alien. This alien needs to know <colexp>how the artifacts function.</colexp> It builds \
      gadgets and buys mechanical scraps from space explorers to learn about new mechanisms. \
      So you will need to <colexp>show the alien which specific part of the artifact it would need to move to operate it, so it can \
      build gadgets that function in similar ways.</colexp></p> \
      <img height = '400' src='stim/alien_explain.png'><img height ='400' src='stim/planet.png' id='planet'>"].join(' '), 
      'str3': ["<u><p>Instructions</p></u>",
      "<p>In each trial, you'll watch a video demonstration of your friend moving the different parts of an artifact around. \
      After each video is done, it will disappear and you'll see a reference picture of the artifact that is color-coded \
      and numbered by the different parts of the artifact.</p> \
      <p>This is a picture of what a trial might look like with a familiar looking object: </p> \
      <div><img height ='400' src='stim/tongsDemo_still.png' id='tongsDemo_still'></div> \
      <p>When you see this reference picture, your task is to press the number \
      on your keyboard that corresponds to the part of the artifact that the alien would need to move in order to operate the artifact. \
      <b>Your task is to do this as <i>quickly</i> and <i>accurately</i> as you can after seeing the reference picture.</b> \
      While you should respond as quickly as you can, <b>please prioritize being accurate.</b></p>"].join(' '), 
      // 'str4': ["<u><p>Instructions</p></u>",
      // "<p>Here is a video of the previous example trial. In this example, the correct answer would be '3'. Click 'Next' when you are ready \
      // to move onto the next instructions.</p> \
      // <div><video autoplay loop height ='650'><source src='stim/tongsDemo.mp4' id='tongsDemo' type='video/mp4'></div>"].join(' '),
      'str5': ["<u><p>Instructions</p></u>",
      "<p>To make sure that you'll be able to press a number on your keyboard as quickly as \
      possible, you will be instructed to place your fingers on the numbers 1-4 and the spacebar on your keyboard before \
      completing any test trials. Using your left hand, you can place your middle finger on the number 1 and pointer finger on the number 2. \
      Using your right hand, you can place your pointer finger on the number 3 and middle finger on the number 4. You can also place your right \
      thumb on the spacebar of your keyboard.</p> \
      <p>Place your fingers on the numbers that lie horizontally across the top of your keyboard. \
      Do not use the numeric keypad if your keyboard has one. Please keep your fingers on the numbers \
      1-4 and spacebar throughout all the test trials. There will be 6 trials.</p> \
      <div><img id='keyboard_combined' class='introImgs' src='stim/keyboard_combined.png'></div>"].join(' '),
      'str6': ["<u><p>Instructions</p></u>",
      "<p>Let's first check that our interface works on your computer and keyboard! \
      In the next part of this game, you'll be presented with a series of numbers. Each time you see a number on your screen, \
      press the number on your keyboard that matches it.</p> \
      <p>Below is an example of a trial. In this example, you would press the number '3' on your keyboard.</p> \
      <div><img id='number_demo' height='500' src='stim/number_demo.png'></div>"].join(' '), 
      'str_keyPractice': "<p>To get ready for the trials, place your fingers on the keyboard numbers 1-4 and your thumb \
      on the spacebar. Keep your fingers on these numbers until you finish the trials.</p> \
      <p>When you are ready to complete the trials, press the 'spacebar' with your thumb, \
      but do not move your fingers from the numbers on your keyboard.</p> \
      <div><img id='keyboard_space' height='300' src='stim/keyboard_space.png'></div>",
      'str_practice': "<p>Great! Keep your fingers where they are right now! Now you'll complete 1 more trial in which \
      you'll see a video of a familar looking artifact and try to figure out which part of it you should move to operate it.</p> \
      <p>When you are ready to complete this trial, press the 'spacebar' with your thumb, \
      but do not move your fingers from the numbers on your keyboard.</p> \
      <div><img id='keyboard_space' height='300' src='stim/keyboard_space.png'></div>",
      'str7': "<p>Well done! When you're ready, click 'Next' to complete a short quiz.</p>",
      'str8': ["<u><p>Instructions</p></u>",
      "<p>Well done! Now that you know how the study interface works, let's take a look at the mysterious space artifacts that you and your friend discovered.</p> \
      <div><img height = '500' src='stim/toy_gallery_small.png' id='gallery'></div><p>Click 'Next' to inspect each artifact.</p>"].join(' '),  
      'str9': ["<u><p>Instructions</p></u>", 
      "<p>Notice how all the artifacts have 2 red components and 2 wires connected to a light bulb? When these red components touch \
      and close the electrical circuit, the light bulb will turn on. <b>Your task is to figure out which part of the machine needs \
      to be moved in order to turn on the light.</b></p> \
      <p>Here is a video demonstration of how the lightbulb works:</p>\
      <video autoplay loop height='300'><source src='stim/fam_light.mp4'></video></p>"].join(' '),
      'str10': ["<u><p>Instructions</p></u>", 
      "<p>Here's a summary of your mission in this game:</p> \
      <p><b>Your task is to figure out which part of the machine needs \
      to be moved in order to turn on the light.</b> The responses that you make on your keyboard will be sent to the alien to teach it how \
      to operate the artifacts so that it also knows how to turn on the light bulb in the artifacts.</p> \
      <div><img height = '300' src='stim/alien_explain.png'><img height ='300' src='stim/planet.png' id='planet'></div> \
      <p>After you watch a video demonstration of each artifact, you'll be presented with a reference picture. \
      When you see the reference picture, you should press the number on your keyboard that corresponds to the \
      part of the artifact that the alien would need to move in order to operate it. Please make your response as quickly \
      as you can. <b>However, accuracy is more important than speed</b>, so please do not rush to make a response before you are confident.</p>"].join(' '), 
      'str_test': "<p>Now you're ready to start the test trials!</p> \
      <p>Please place your fingers on the keyboard numbers 1-4 and thumb on the spacebar. Keep your fingers on these numbers until \
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

    var gears1 = "<div><img height = '500' src='stim/gears_1_small.png' id='gears1'></div>"
    var gears2 = "<div><img height = '500' src='stim/gears_2_small.png' id='gears2'></div>"
    var levers1 = "<div><img height = 500' src='stim/levers_1_small.png' id='levers1'></div>"
    var levers2 = "<div><img height = '500' src='stim/levers_2_small.png' id='levers2'></div>"
    var pulleys1 = "<div><img height = '500' src='stim/pulleys_1_small.png' id='pulleys1'></div>"
    var pulleys2 = "<div><img height = '500' src='stim/pulleys_2_small.png' id='pulleys2'></div>"

    var objFamiliarization = {
      type: 'instructions',
      pages: _.shuffle([gears1, gears2, levers1, levers2, pulleys1, pulleys2]),
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000
    }

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
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };

    // var introMsg_2 = {
    //   type: 'instructions',
    //   pages: [
    //     instructionsHTML.str4,
    //   ],
    //   show_clickable_nav: true,
    //   allow_backward: false,
    //   delay: true,
    //   delayTime: 20000,
    // };

    var introMsg_3 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str5,
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
        instructionsHTML.str6,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };
    
    var introMsg_5 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str7,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };

    var introMsg_6 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str8,
      ],
      show_clickable_nav: true,
      allow_backward: false,
      delay: true,
      delayTime: 2000,
    };

    var introMsg_7 = {
      type: 'instructions',
      pages: [
        instructionsHTML.str9,
        instructionsHTML.str10,
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
        {prompt: "<b>Question 3</b> \
        <br>You should press the keyboard number that corresponds to the part of the artifact: ",
        name: 'whatPartToPress',
        horizontal: false,
        options: ["That is most brightly colored", 
                  "That looks the most interesting", 
                  "That you would need to move to show the alien how to operate it"],
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
        if ((resp['whatToDoDO'] == 'Keep your fingers on the numbers 1-4') &&
          (resp['whatToClick'] == 'Prioritize accuracy') &&
          (resp['whatPartToPress'] == 'That you would need to move to show the alien how to operate it') &&
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
        // {
        //   prompt: "What device type did you use?",
        //   name: "deviceType",
        //   horizontal: true,
        //   options: ["Track Pad", "Mouse", "Other"],
        //   required: true
        // },
        {
          prompt: "Did you encounter any technical difficulties while completing this study? \
            This could include: images and/or videos were glitchy (e.g., did not load, ability to click on keyboard \
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
        Our researchers will assign your participation credit as soon as they can.</p>" 
        // If you do not receive credit after that period of time, please email \
        // <b><a href='mailto://cogtoolslab.requester@gmail.com'>cogtoolslab.requester@gmail.com</a></b></p>"
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
    // if (includeIntro) setup.push(introMsg_2);
    if (includeIntro) setup.push(introMsg_3);
    if (includeIntro) setup.push(introMsg_4);

    setup.push(keyboardMsg_keyPractice);

    // var experiment = setup.concat(trials);

    // var practice_list = [practice1];
    // practice_shuff = _.shuffle(practice_list);
    // var experiment = setup.concat(practice_shuff);

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
    var practice_list = [practice1];
    practice_shuff = _.shuffle(practice_list);
    var practice = keys.concat(practice_shuff);

    if (includeIntro) practice.push(introMsg_5);
    if (includeQuiz) practice.push(loopNode);

    // add test trials
    if (includeIntro) practice.push(introMsg_6);
    if (includeIntro) practice.push(objFamiliarization);
    if (includeIntro) practice.push(introMsg_7);
    if (includeIntro) practice.push(keyboardMsg_test);
    var experiment = practice.concat(trials);

    // add exit info
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
      // 'stim/bopit_intro.png',
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
      // 'stim/bopitDemo.mp4',
      'stim/tongsDemo.mp4',
      'stim/fam_light.mp4', 
      'https://causaldraw.s3.amazonaws.com/gears_1_ABBA_30.mp4',
      'https://causaldraw.s3.amazonaws.com/gears_2_BAAB_30.mp4',
      'https://causaldraw.s3.amazonaws.com/levers_1_BAAB_30.mp4',
      'https://causaldraw.s3.amazonaws.com/levers_2_ABBA_30.mp4',
      'https://causaldraw.s3.amazonaws.com/pulleys_1_ABBA_30.mp4',
      'https://causaldraw.s3.amazonaws.com/pulleys_2_BAAB_30.mp4'
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