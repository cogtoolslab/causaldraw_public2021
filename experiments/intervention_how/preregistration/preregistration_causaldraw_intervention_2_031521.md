# Preregistration for intervention_how experiment

**Researchers:**
Holly Huey, Caren Walker, and Judith Fan

## Study info
**Title:**
causaldraw_intervention_2: Using visual representations of physical mechanisms to identify how objects function

### Description
Causal knowledge allows us to make predictions about future events and act upon objects in order to generate desired outcomes[1-2]. Huey, Walker, and Fan (2020) collected a dataset of 300 sketches to explore visual communication as a means to convey causal knowledge to others in a condensed, exportable format. This study capitalized on prior work that has examined how the spatial layout of elements in well-designed visualizations, such as sketches, mirrors the placement and relations of elements in the physical world, making it easier to grasp the correspondence among elements in each domain[3-6]. Visualizations have also been shown to promote inference of abstract relations by leveraging a small set of relational symbols, such as lines and arrows[7-8]. 

In the original study, participants drew simple machines (gears, levers, and pulleys), which comprise a unique class of objects that can be rich in both visual appearance and causal information. They were prompted to generate visual explanations (e.g., of how a machine functions) or visual depictions (e.g., of what a machine looks like). Results demonstrated that, while participants tended to devote an approximately equal amount of ink and equal number of strokes between conditions, they drew a higher proportion of causally relevant elements in visual explanations than visual depictions (P<.001). Participants also employed more symbols and drew less background elements in their visual explanations (P<.001, respectively). Here we use “background” to describe the elements that were not did not contribute to the machines’ function. 

Critically, however, visual communication constitutes both production of representations and interpretation of them. In a subsequent study, we presented naive viewers with the original dataset of sketches and photographs of the original machine stimuli. Strikingly, we found that viewers were actually less accurate when cued with a visual explanation than with a depiction (explanation: 68%; depiction: 72%, P<.001), suggesting that greater emphasis on causal elements and the usage of symbols in explanatory drawings did not necessarily help naive viewers locate the causally relevant element, at least relative to depictions. However, this study only probed viewers’ ability to localize the element that require intervention, but did not investigate how well they were able to identify what kind of intervention was needed. 

Therefore, in the present study, we will present a new group of naive viewers with the same sketch dataset. By measuring (1) whether participants can accurately infer what kind of intervention is needed to operate the machine, and (2) their response time, the study aims to analyze which properties of sketches, such as which elements were drawing, differentially facilitate participants’ inference of the objects’ causal structure. 
## Study Information
### Hypotheses
If  participants of the original study (Huey, Walker, & Fan, 2020) were more selective when producing informative visual explanations than when producing faithful visual depictions, we hypothesize that visual explanations will contain more causally relevant information. 

Specifically: 

We predict visual explanations will enable more accurate inferences about what kind of intervention (e.g., pulling, pushing, rotating) is needed to operate the represented machines, relative to visual depictions.

We predict visual explanations will enable shorter response times than visual depictions. 

We predict sketches that contain more symbols will lead to more accurate inferences about how to operate the target machine and shorter response times. Here, the amount of symbols within a sketch will be determined by the total number of strokes used to depict symbols. 

We predict sketches that contain more causally relevant elements will lead to more accurate inferences about how to operate the target machine and shorter response times. These elements will be quantified by the  total number of strokes used to depict causally relevant elements. 

## Design Plan
### Study type
Experiment - A researcher randomly assigns treatments to study subjects. This is also known as an intervention experiment and includes randomized controlled trials

### Blinding
For studies that involve human subjects, they will not know the treatment group to which they have been assigned. 

### Is there any additional blinding in this study?
No response

### Study Plan
On a custom web-based platform, participants will be presented with sketches from the original study (Huey, Walker, & Fan, 2020). They will be told that the sketches represent machines and that their task is to identify the kind of action needed to operate the represented machine based on their interpretation of the sketch.
During test trials, participants will be presented with a single sketch and four buttons below the sketch labelled as “Pull”, “Push”, “Rotate”, and “I don’t know”. Participants will be instructed to click on the button that describes the action needed to operate the represented machine and will be asked to prioritize accuracy. 

Participants will complete 6 trials, in which each trial will be a different represented machine (e.g., gear, lever, or pulley machine) and level of complexity. Each session of 6 trials will contain an approximately equal number of visual explanations and visual depictions. 

To ensure that participants are familiar with the web interface, they will also complete practice trials in which they will see numbers appear on their screen and buttons that are labelled 0-3. They will be instructed to click on the button that corresponds to the presented number. After these practice trials, participants will complete 3 more practice trials to gain experience with interpreting sketches. Just as in test trials, they will be presented with a sketch of a machine (in these practice trials, a “Bopit” toy) and buttons labeled as “Pull”, “Push”, “Rotate”, and “I don’t know”. Upon seeing the sketch, they will be instructed to click the button that describes the action that is needed to operate the represented machine. 

## Sampling Plan
### Existing Data
Registration following analysis of the data: As of the date of submission, you have accessed and analyzed some of the data relevant to the research plan. This includes preliminary analysis of variables, calculation of descriptive statistics, and observation of data distributions. Please see cos.io/prereg for more information. 

### Data collection procedures
We plan to include 50 English-speaking adults. Participants will be recruited from the University of California, San Diego study pool through SONA and will receive 0.5 credit for their participants in our ~30 minute study. 

### Sample
We plan to include 50 English-speaking adults who did not participate in other studies of this visual communication series. 

### Sample size rationale
Because this is an exploratory study, we do not yet have reliable estimates of effect size. Our sample size was therefore chosen in order to obtain enough data to get initial estimates of effect size, as well as estimates of individual and item-level variation. This sample size rationale was also guided by a similar sample size of the original study (Huey, Walker, & Fan, 2020)

### Stopping rule
Data collection will stop when 50 participants have successfully completed the study.

## Variables
### Measured variables
We will analyze the effect of condition on two outcome variables: accuracy and response time.

## Analysis
### Statistical Models
Below are how we plan to specify each measured variable corresponding to the statistical model: 

Response time (RT)
First, we will attempt to fit the maximal versions of each model, including both random slopes and intercepts for participants (i.e., `orig_gameID`), items (i.e., `toy_type`), and sketch (i.e., `sketchID`). We will only analyze response times of trials in which participants responded accurately. 

m_fullRT <- lmer(log(rt) ~ condition + condition*numCausal + condition*numFunctional + condition*numSymbol + condition*numBackground + (1|sketchID) + (1|toy_type) + (1|orig_gameID) + (totalStrokes|condition) + (totalStrokes|toy_type), data=final_data_RT, REML=FALSE)

If the model fails to converge, we will remove the random intercepts of toy_type and interactions with totalStrokes: 

m_reducedRT <- lmer(log(rt) ~ condition + condition*numCausal + condition*numFunctional + condition*numSymbol + condition*numBackground + (1|sketchID) + (1|orig_gameID), data=final_data_RT_corrAns, REML=FALSE)

Accuracy (corrAns)
Because corrAns is binary (0 = incorrect, 1 = correct), we will use a glmer model: 

m_fullcorrAns <- glmer(orrAns ~ condition + condition*numCausal + condition*numFunctional + condition*numSymbol + condition*numBackground + (1|sketchID) + (1|toy_type) + (1|orig_gameID) + (totalStrokes|condition) + (totalStrokes|toy_type), family="binomial", data=final_data, nAGQ=0)

If the model fails to converge, we will use the below: 

m_reducedcorrAns <- glmer(corrAns ~ condition + condition*numCausal + condition*numFunctional + condition*numSymbol + condition*numBackground + (1|sketchID) + (1|orig_gameID), family="binomial", data=final_data, nAGQ=0)

### Data exclusion
Sessions will be excluded from analysis based on the below exclusion criteria: 

Technical failure: Participants will complete an exit survey at the end of the experiment. If participants report that any of the sketches or images of machines did not display properly (e.g., images did not load or did not load at the same time) or if the interface did not function properly on a trial (e.g., trial did not advance after the participant made a keyboard response), all data from that session will be excluded from subsequent analysis. 

Session-level accuracy-based exclusion: 
All data from a session will be excluded if accuracy is less than 50% (i.e., if participants correctly responded to only 3 out of the 6 test trials). 

3. Trial-level response time outlier exclusions: 
Absolute: To ensure that participants are making thoughtful decisions and not merely clicking through the task, trials will be excluded from subsequent analysis if the response time is less than 0.4 seconds. Trials will also be excluded from subsequent analysis if participants do not make a response in 10 seconds.  
Relative: Trials will be excluded if response times are greater than 2.5 standard deviations above the mean (using mean & sd on N-1 sample excluding that session).

We plan to release “raw” group dataframes containing all sessions and trials, but “flag” sessions and trials that meet our exclusion criteria to make it easy to filter these out during analysis. We further plan to apply the same analyses to both the raw & filtered datasets to evaluate the impact of our exclusion criteria on our conclusions. 

## Other
### Other
References
<br>
[1] Sloman, S. (2005). Causal models: how people think about the world and its alternatives. Oxford University Press.
<br>
[2] Meltzoff, A. (2007). Infants’ Causal Learning. Causal learning: psychology, philosophy, and computation, 37-47. Oxford University Press.
<br>
[3] Tversky, B., Agrawala, M., Heiser, J., Lee, P., Hanrahan, P., Phan, D., & Daniel, M. P. (2006). Cognitive design principles for automated generation of visualizations. In Allen G, editor. Applied Spatial Cognition: From Research to Cognitive Technology, 53-75. Hillsdale, NJ: Lawrence Erlbaum Associates, Inc. 
<br>
[4] Larkin, J., & Simon, H. (1987). Why a diagram is (sometimes) worth ten thousand words. Cognitive Science: A Multidisciplinary Journal, 11, 65–100.
<br>
[5] Tversky, B., & Bobek, E. (2016). Creating visual explanations improves learning. Cognitive Research: Principles and Implications, 1(1), 27.
<br>
[6] Tversky, B., & Morrison, J. B. (2002). Animation: can it facilitate? International Journal of Human-Computer Studies, 57, 247-262.
<br>
[7] Tversky, B., & Heiser, J., (2006). Arrows in comprehending and producing mechanical diagrams. Cognitive Science, 30, 581-592. 
<br>
[8] Tversky, B., Zacks, J., Lee, P., & Heiser, J. (2000). Lines, blobs, crosses and arrows: Diagrammatic communication with schematic figures. In International conference on theory and application of diagrams, 221-230. Springer, Berlin, Heidelberg.
