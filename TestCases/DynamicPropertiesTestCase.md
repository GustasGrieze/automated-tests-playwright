# Test Case – Progress Bar Widget

## Test Case Information

| Attribute | Value |
|---|---|
| **Test Case ID** | TC_WIDGETS_001 |
| **Title** | Verify Progress Bar start, stop, completion, and reset behavior |
| **Target Application** | https://demoqa.com/ |
| **Module** | Widgets / Progress Bar |
| **Objective** | Verify that the Progress Bar starts correctly, can be stopped before completion, reaches 100% when resumed, and resets to 0%. |
| **Test Type** | Functional UI Test |
| **Scenario Type** | Positive / Happy Path |
| **Preconditions** | Application is accessible and the user can open the Progress Bar widget page. |
| **Test Data** | Target intermediate value: 40% |
| **Expected Result** | The progress bar starts, stops before 100%, resumes to 100%, and resets back to 0%. |
| **Postconditions** | Progress Bar is reset to initial state. |
| **Priority** | High |

---

## Test Scenario

The user opens the Progress Bar widget, starts the progress, stops it around 40%, verifies that it stopped before completion, resumes progress to 100%, verifies that the Reset button appears, and then resets the bar to 0%.

---

## Test Steps

| Step No. | Test Step | Expected Result |
|---|---|---|
| 1 | Open browser. | Browser opens successfully. |
| 2 | Navigate to `https://demoqa.com/`. | DemoQA homepage is displayed. |
| 3 | Open the **Widgets** section. | Widgets section is opened. |
| 4 | Click **Progress Bar** in the left menu. | Progress Bar page is displayed. |
| 5 | Verify that the progress value is `0%`. | Initial progress value is `0%`. |
| 6 | Verify that the **Start** button is visible. | Start button is displayed. |
| 7 | Click **Start**. | Progress bar begins increasing. |
| 8 | Wait until the progress value reaches at least `40%`. | Progress reaches `40%` or more. |
| 9 | Click **Stop**. | Progress bar stops increasing. |
| 10 | Verify that the progress value is greater than or equal to `40%`. | Progress value is at least `40%`. |
| 11 | Verify that the progress value is less than `100%`. | Progress has not yet completed. |
| 12 | Click **Start** again. | Progress bar resumes. |
| 13 | Wait until the progress value becomes `100%`. | Progress reaches `100%`. |
| 14 | Verify that the **Reset** button is visible. | Reset button is displayed. |
| 15 | Click **Reset**. | Progress bar returns to initial state. |
| 16 | Verify that the progress value is `0%`. | Progress resets to `0%`. |

---

## Verifications

1. Progress value is initially `0%`.
2. Progress value reaches at least `40%` after starting.
3. Progress value remains below `100%` after stopping.
4. Progress value reaches `100%` after resuming.
5. Reset button appears at completion.
6. Progress value returns to `0%` after reset.