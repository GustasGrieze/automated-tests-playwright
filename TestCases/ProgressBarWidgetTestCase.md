# Test Case – Dynamic Properties

## Test Case Information

| Attribute | Value |
|---|---|
| **Test Case ID** | TC_DYNAMIC_001 |
| **Title** | Verify delayed enablement, visibility, and style change on Dynamic Properties page |
| **Target Application** | https://demoqa.com/ |
| **Module** | Elements / Dynamic Properties |
| **Objective** | Verify that dynamic properties update correctly after page load: the disabled button becomes enabled, the hidden button becomes visible, and the color change button changes its style. |
| **Test Type** | Functional UI Test |
| **Scenario Type** | Positive / Happy Path |
| **Preconditions** | Application is accessible and the Dynamic Properties page can be opened. |
| **Test Data** | No external input data required. |
| **Expected Result** | Dynamic elements change state correctly after the expected delay. |
| **Postconditions** | Page remains loaded with updated dynamic elements. |
| **Priority** | High |

---

## Test Scenario

The user opens the Dynamic Properties page, verifies the initial states of the dynamic elements, waits for the delayed changes to occur, and verifies that the button becomes enabled, the hidden button becomes visible, and the color-changing button updates its style.

---

## Test Steps

| Step No. | Test Step | Expected Result |
|---|---|---|
| 1 | Open browser. | Browser opens successfully. |
| 2 | Navigate to `https://demoqa.com/`. | DemoQA homepage is displayed. |
| 3 | Open the **Elements** section. | Elements section is opened. |
| 4 | Click **Dynamic Properties** in the left menu. | Dynamic Properties page is displayed. |
| 5 | Verify that the **Will enable 5 seconds** button is disabled initially. | Button is visible and disabled. |
| 6 | Verify that the **Color Change** button is visible. | Color Change button is displayed. |
| 7 | Verify that the **Visible After 5 Seconds** button is not visible initially. | Delayed visibility button is hidden. |
| 8 | Capture the initial style/class of the **Color Change** button. | Initial style/class value is stored. |
| 9 | Wait until the **Will enable 5 seconds** button becomes enabled. | Button becomes enabled. |
| 10 | Verify that the **Visible After 5 Seconds** button appears. | Button becomes visible. |
| 11 | Verify that the **Color Change** button style/class changes from the initial value. | Button style/class is updated. |

---

## Verifications

1. **Will enable 5 seconds** button is initially disabled.
2. **Will enable 5 seconds** button becomes enabled after delay.
3. **Visible After 5 Seconds** button is initially hidden.
4. **Visible After 5 Seconds** button becomes visible after delay.
5. **Color Change** button style/class changes after delay.