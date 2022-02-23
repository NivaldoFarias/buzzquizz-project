<div id="top"></div>

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="https://github.com/NivaldoFarias/projeto6-buzzquizz">
    <img src="dist\img\buzzfeed-logo.png" alt="Logo" width="150">
  </a>

<h3 align="center">BuzzQuizz</h3>
  <h6 align="center">WIP</h6>
  <p align="center">
    Web Development Project using HTML, SCSS and JS
    <br />
    <a href="https://github.com/NivaldoFarias/projeto6-buzzquizz/blob/main/index.html"><strong>HTML code»</strong></a>
    -
    <a href="https://github.com/NivaldoFarias/projeto6-buzzquizz/blob/main/scss/main.scss"><strong>SCSS code»</strong></a>
    -
    <a href="https://github.com/NivaldoFarias/projeto6-buzzquizz/blob/main/js/script.js"><strong>JS code»</strong></a>
</div>

![Banner](https://github.com/NivaldoFarias/projeto6-buzzquizz/blob/main/dist/img/protejo6-buzzquizz-full.png?raw=true)

<!-- ABOUT THE PROJECT -->

### Built With

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)


## Requirements

- General
  - [x] Vanilla JS only
  - [x] Github public Repository
  - [x] Commit every requirement
- Layout
  - [x] Mobile layout structured using given template
- Screen 1
  - [x] All quizzes given by the API's server must be listed
  - [x] User quizzes list must show only the ones they created, while the list below must not contain these user quizzes
  - [x] Quizzes layout according to template on Figma. Upon clicking on a quizz, first screen must give place to second screen
  - [x] Upon Clicking on "Create Quizz", first screen must give place to third screen
- Screen 2 (questions)
  - [x] Quizz banner according to template
  - [x] Answers to each question must be listed randomly
  - [x] After clicking on an answer, the rest must have a "dimmed" filter 
  - [x] User must not be able to change answer after they have made a choice
  - [x] After choosing an answer, colors of the text below of each answer must change to red or green, depending on if it is the correct or incorrect answer
  - [x] 200 milliseconds after choosing, screen must scroll to next question 
- Screen 2 (end of quizz)
  - [x] After responding all questions, quizz's final result must be shown and screen must scroll to it
  - [x] Quizz's points (percentage of hits) must be calculated in front-end, as well as the quizz's level the user landed on
  - [x] Title, image and description of the level the player landed on must be shown
  - [x] Score must be rounded 
  - [x] Upon clicking "Restart Quizz", screen must screen to the beginning, all answers must be zeroed-out, and results hidden 
  - [x] Upon clicking "Home Page", second screen must be given place to first screen
  - [x] Upon clicking the background, sidebar must close
- Screen 3
  - [x] Quizz creation has 4 sections, and on each, before advancing to next screen, validations to input infos must be made, as in:
    - Screen 3.1: Quizz basic info
      - [x] Quizz title: between 20 to 65 characters
      - [x] Image URL: must be a valid URL
      - [x] Number of questions: 3 questions minimum
      - [x] Number of levels: 2 levels minimum
    - Screen 3.2: Quizz questions
      - [x] Questions text: 20 characters minimum
      - [x] Background color: must be a hexadecimal code
      - [x] Answer's image URL: must be a valid URL
      - [x] Correct answer and at least one incorrect answer must be filled out
    - Screen 3.3: Quizz Levels
      - [x] Level title: 10 characters minimum
      - [x] Mininum hit percentage: a number between 0 and 100
      - [x] Level's image URL: must be a valid URL
      - [x] Level description: 30 characters minimum   
      - [x] At least one level must have a hit mininum of 0%
  - [x] If validation fails, an alert must be shown, alerting the user to fill the data correctly
  - [x] After finishing the quizz's creation and saving it to serverm user must view screen 3.4. In this screen, user may click on "Acess Quizz" button to visualize the quizz they have created (screen 2), or return to home page (screen 1)
  - [x] When user returns to home page, the page must be updated to show newly created quizzes
- Screen 3
  - [x] Server will resppond with an object containing an ID unique to the user-created quizz
  - [x] Created quizz's ID must be stored in local storage
  - [x] On screen 1, these user-created quizz's IDs must be compared to quizzes sent by server
 - Deploy
  - [x] Deploy to Github Pages
- Bonus (optional)
  - Bonus 1: Delete quizz
    - [x] Button to allow user to delete an existing quizz that belongs to them
    - [x] Upon clicking the button, a confirmation pop-up must be shown 
    - [x] After confirmation, quizz must be deleted from server and user's quizzes must be listed once again
  - Bonus 2: Edit quizz
    - [x] Button to allow user to edit an existing quizz that belongs to them
    - [x] Upon clicking the button, a screen identical to quizz creation screen must be shown, with filled out sections acordding to current quizz. User may change inputs and each section must be validated 
    - [x] After finishing the edit, if they return to home page, user's created quizzes must be listed once again 
  - Bonus 3: Loading screens
    - [x] Quizzes list loading
    - [x] Quizz loading 
    - [x] Create/edit/delete quizz loading
  - Bonus 4: Show validation errors
    - [x] Each validation error must have an unique alert below them shown

<!-- Study Playlist -->

### Study Playlist

In this section I included all Youtube content I used or refered to while studying for this project. Keep in mind that most of these videos contain information that was not previously studied during class, which may affect some parts of the code that contain these _extras_.

<a href="https://youtube.com/playlist?list=PLoZj33I2-ANTWqU331l3ZGlZV8I7rr5ZN">![Youtube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)</a>

<!-- CONTACT -->

### Contact

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Slack][slack-shield]][slack-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://www.linkedin.com/in/nivaldofarias/
[slack-shield]: https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white
[slack-url]: https://driventurmas.slack.com/team/U02T6V2D8D8/

### Contributors

<a href="https://github.com/NivaldoFarias/projeto6-buzzquizz/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=NivaldoFarias/projeto6-buzzquizz" />
</a>

##### Made with [contrib.rocks](https://contrib.rocks).
