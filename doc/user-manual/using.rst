
Using Bro (Robin)
=================

This chapter gives an overview of using |Bro|. We will take a closer
look at the system's output, a number of the standard policy
scripts, and basic ways of tuning the system to a site's specifics.

Our discussion will need a bit of knowledge about the scripting
language and we will introduce the relevant pieces as we go.
However, for a more thorough discussion of writing Bro scripts we
refer to `scripting`_. 

.. todo:: All examples in this chapter are based on Bro 1.5. They
   will need updating for the changes in 1.6.

* Understanding Bro's Output
  - Notices and Alarms
  - Activity Logs
  - Weird Activity
  - Standard Policy Files
  -  <Some of the more important ones>
  
* Behind the Curtain:
  - Capture Filters
  - Dynamic Protocol Detection

* Customizing Scripts
  - Building a Site Policy   
  - Notice Policy
  - Tuning

* (Active Response? Might skip this.)
   
Testing the script role: :script:`conn.log`. 

Testing the Bro macro: |Bro|.
