---
layout: post
title:  "Designing a Transit Map: User Experience Design"
date:   2018-11-17 00:00:00 -0700
---

### With the launch of Calgary's new [Bus Rapid Transit (BRT)][calgary_brt], I experimented with designing an [interactive transit map][brt_map] to visualize the new system. The challenge involved creating an accessible, intuitive map where a user could quickly see the new routes and explore connections.

Through this exercise, I explored a little about User Experience (UX) Design. UX is defined as a person's perception and response that results from the use or anticipated use of a product, system or service (wikipedia).

The basis of designing the map involved understanding the concept of user interaction. Interaction requires the user to employ perceptual, motor or cognitive abilities as they view manipulate and interpret an interactive map [(GISTBOK)][GISTBOK]. You can't discuss UX design or interactions without bringing up Dan Norman's The Design of Everyday Things. Norman describes an interaction by seven discrete stages (source: [GISTBOK][GISTBOK]):

1. **Forming the Goal** - High level tasks, goal that the user is trying to achieve
2. **Forming the Intention** - Specific map reading objective the user hopes to complete in supporting the goal. The intention yields a specific geographic insight.
3. **Specifying an Action** - Translating the intentions to functions to be implemented in the interface. The interface must have a strong signifier, a clue that communicates how the user can interact with the interface.
4. **Executing an Action** - Execute the specified action using an input (touch, mouse, keyboard, etc.)
5. **Perceiving the System State** - Once executing the action, the user must view a new representation. Feedback is used to signal what has happened as a result of the interaction
6. **Interpreting the System State** - After perceiving the new map representation the user must make sense of the update.
7. **Evaluating the Outcome** - The evaluation compares the insight with the expected result and determines if the goal has been achieved.

!['Calgary BRT'](https://nodalscapes.files.wordpress.com/2018/10/screenshot5.png?w=1476)

I used Mapbox and React to bring the all the concepts together for this project. In terms of fast prototyping, both Mapbox and React are excellent tools. The concept of signifiers and feedback were the most important elements in the interface design. Without cluttering the design and interface, I wanted to create simple signifiers, leading users to click on BRT lines to display the stops. Minimal information is displayed on the map until the user executes a function, after which the map changes state and loads new features (such as stops). The connecting bus stops are shown when a user mouses over the BRT stop and rollover states change when a user mouses over each connecting stop.

The feedback on the state changes are achieved by using auto zoom and pan feature that focuses the user on the highlighted bus route. The user can then perceive the new map feature and evaluate the map representation.

You can find the map [here][brt_map] and the github repo [here][github].

[brt_map]:https://smohiudd.github.io/calgary-transit-brt/
[github]:https://github.com/smohiudd/calgary-transit-brt
[GISTBOK]:https://gistbok.ucgis.org/bok-topics/user-interface-and-user-experience-uiux-design
[calgary_brt]:http://www.calgary.ca/Transportation/TI/Pages/Transit-projects/Transitway-and-BRT-Projects.aspx?redirect=/brt
