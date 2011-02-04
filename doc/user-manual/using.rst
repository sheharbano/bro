
.. _using:

Using Bro (Robin)
=================

This chapter gives an overview of using |Bro|. We will take a closer
look at the system's output, a number of the standard policy
scripts, and basic ways of tuning the system to a site's specifics.

Our discussion will need require a bit of knowledge about the
scripting language, and we will introduce the relevant pieces as we
go. For a more thorough discussion of writing Bro scripts, refer to
`scripting`_. 

In this chapter, we will run Bro directly from the command line, as
shown in `starting`_, as that gives a better feel for how the
individual pieces fit together. In `broctl`_, we will see how to
apply these concepts to an operational setting using |BroControl|.

.. todo:: All examples in this chapter are based on Bro 1.5. They
   will need updating for the changes in 1.6.

Running Bro
-----------

As we have already seenin `starting`_, running Bro from the command
line is straight-forward::

    > bro -i eth0 mt http-request 

Generally, when starting Bro, you need tell it two things: where to
read network packets from, and which analysis to perform.

There are two options for giving packet sources. First, you can run
*online* and have it read from a live network interface specified by
``-i <interface>``, as in the example above. If so, you need to make
sure that the user running Bro has appropiate permissions to open
the given interface in "promiscious mode"; see the sidebar
`permissions`_ for more information.

The other option is giving Bro a previously recorded trace file to
work with by adding ``-r <file>`` to the command line. The trace file
must be in standard :tool:`libpcap` format, as for example produced
:tool:`by tcpdump` or :tool:`Wireshark`. Running Bro *offline* in this
way is often useful when developing and testing a specific Bro
configuration, as you will get reproducable results and can track down
effects directly by looking at the raw input. It also does not require
special priviliges other than read access to the trace file, making it
suitable to pass a vette trace on to others. 

Bro does not differentiate further between online and offline mode.
Specifically, you will generally get the same results independent of
whether Bro reads a particular set of packets off the live interface,
or out of trace. Internally, the tricky part with this model is
getting the analysis timing to match in both cases; see
`network_time`_ for more information on how Bro addresses this
problem. 

The second ingredient to a Bro command line is the analysis to 
perform, which is specified via a set of Bro scripts to execute. The
example above tells Bro to read one script called ``mt``. As the
invocation does not specify any further path to the script, Bro will
search it along its default search path, adding an implicit ``.bro``
extension while doing so. To see what the default path is in your
environment, inspect the output of ``bro --help``.[#bropath]_

One of the main initial challenges of using Bro is finding out which
scripts to load, as the standard distribution comes with so many of
them. There is no simple answer to that question unfortunately, as the
specifics depend to a large degree on the environment Bro is running
in. However, throughout this book, we will examine many of shipped
scripts in more detail, and see what analyses they perform as well as
what output they generate. Also, most scripts are documented
extensively in Bro's reference manual. With this knowledge, you can
then select those that are appropiate for your needs and assemble them
into a local *site policy*, as we discuss in `site policy`_.

That said, you should keep in mind that the policy scripts coming with
Bro only reflect a small *subset* of analyses that Bro is able to
perform, usually something that somebody else has already found useful
to do in the past. Bro is much more general however, as it provides
you with a *platform* to implement the specific analyses you need in
your environment. In this sense, Bro is similar to other,
general-purpose scripting languages such as Python or Perl. While they
likewise come with extensive libraries of high-level functionality,
their principal power lies in providing their users with a *language*
for expressing custom tasks. Similarly, with Bro, while you can (and
should) rely on existing scripts where they fit your needs, you will
unleash its real power once you start writing your own scripts.

.. todo:: Scripts are not documented *yet* ...

.. [#bropath] Setting the environment variable ``BROPATH`` overrides
   the default search path. If done so, the output of ``bro --help``
   will reflect the customized setting.

.. _permissions:

.. sidebar:: Interface Permissions

    Bla Bla Bla.

.. _network_time:

.. sidebar:: The Question of Time

    Bla Bla Bla.


Understanding Bro's Output
--------------------------

- Bro produces two types of output: alarms, and activity logs. The
  first is normal, the second is something that puts Bro above
  everything else.

Notices and Alarms
~~~~~~~~~~~~~~~~~~

Two layered approach to alarms: activity that is potentially
relevant; and activity that is escalated into something important.

The first are Notices, and scripts generally flag them quite
liberally. Many of them will be uninteresting during operation, but
it's up to the user to decide. Show notice.log

Alarms are escalated notices. Show alarm.log. By default, all
notices are escalated, but you can tune. 

Activity Logs
-------------

Connection Summaries
~~~~~~~~~~~~~~~~~~~~

Most simple, but also single most useful. Netflow-style summaries.

Works for TCP with the obvious semantics; but is also used for UDP
and ICMP. 

See local_nets later. 

Application-layer Logs
~~~~~~~~~~~~~~~~~~~~~~

HTTP
^^^^

FTP
^^^

SMTP
^^^

    Sidebar: How does Bro know the protocol?

    .. todo:: We describe this here with assuming DPD and
       seeing-all-packets is the default. We still need to decide
       whether we want to make that change. 


Customizing Bro
---------------

.. _site policy:


Building a Site Policy
~~~~~~~~~~~~~~~~~~~~~~

Where to put it. 

Internal parameters, vs. script-level options.

Notice Policy
~~~~~~~~~~~~~


   
Testing the script role: :script:`conn.log`. 

Testing the Bro macro: |Bro|.


