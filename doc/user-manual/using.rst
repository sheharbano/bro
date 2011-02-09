
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

You find Bro's output in the form of log files produced inside the
directory it is started from, generally called ``<name>.log``, where
``name`` indicates what kind of content the file records. Often, a
single Bro policy script is generating a particular file, and in that
case, the file is typically named accordingly (e.g., the script
``smtp.bro`` generates a log file ``smpt.log``).

By default, all logs are saved as plain text ASCII files organized in
tab-separated columns. [#logging-backends]_ Note that the order of
columns is generally not well-defined and may change across Bro
versions. However, each log file has a header line at the beginning
defining the column structure.

Generally, Bro's output falls into one of two categories: *alarms* and
*activity logs*. Like with other intrusion detection systems, the
former report attacks found by one of its detectors. The latter on the
other hand records *all* activity seen in a specific context, such as
using the same application protocol.

In the following, we will discuss alarms as well as the most commonly
used activity log files in more detail. Note that Bro has extensive
capabilities for filtering and restructuring the logs' content, and we
will discuss customization in `customizing-logs`_. For now, we will
focus on the *information* you find in the logs. 

.. [#logging-backends] Future Bro versions will provide additional
   *backends* for logging in other formats than tab-separated ASCII.
   In particular, we are planing to add an efficient binary storage
   format for high-volume environments. 


Alarms
~~~~~~

Being a network intrusion detection system, Bro reports *alarms* for
attacks it detects. Most of Bro's policy scripts include detectors for
malicious activity, and they raise alarms whenever they triggers. For
example, Bro's HTTP analysis scans client requests for a set of
suspicious paths, such as ``/etc/passwd``. Let's run this on a little
trace that contains such a request::

    > bro -r trace-with-attack.trace http
    <<Alarm>>>
 
Bro detects the potential attack and prints an alarm to standard
error. More typically, however, one want alarms to be recorded
instead, and loading Bro's :script`alarm.log` script will do so::

    > bro -r trace-with-attack.trace http alarm
    > cat alarm.log
    <<Alarm>

The interpretation here is that everything ending up in `alarm.log` is
an actionable event for the security stuff. While by default, most
activity flagged by any script will be recorded there, we will see in
`notice-policy`_ that Bro provides extensive filtering capabilities
for defining precisely what is worth being escalated in this form. In
addition to logging an alarm, Bro can also trigger further external
actions by executing custom shell scripts; see `shell-scripts`_.

Activity Logs
~~~~~~~~~~~~~

Activity logs generally record all activity of a certain kind in
high-level terms, such as the main semantic pieces of a particular
protocol. These logs do specifcally *not* assess traffic further in
terms of whether it is benign and malicious, yet by recording the
complete picture, provide us with a *neutral* log record of a
network's activity. In practice, these activity logs are often
invaluable for forensic purposes, as they allow you to "go back in
time" and understand what *exactly* happened, say, two weeks ago with
a system now found to have beeen compromised around that time.

In the following, we examine a few of these logs in more detail.

Connection Summaries
^^^^^^^^^^^^^^^^^^^^

Perhaps the single most useful activity log that Bro produces is
`conn.log`, recording singe-line summaries of all connections seen on
the network. Loading the :script:`tcp` script will produce such
"connection logs" for all TCP traffic::

    > bro -r tcp-connections.pcap conn
    > cat conn.log
    <output>

As you see, for each TCP connection in the trace, the log records
features such as timestamps (in seconds since Jan 1, 1970, i.e., the
Unix epoch; originator and responder addresses; the protocol being
used; and the payload volume. Table `conn-fields`_ summarizes the
fields available. To convert the timestamps into a more readable
format, Bro comes with a little helper tool, :tool:`cf`::

    > cat conn.log | cf 
    <output>

For generating these summaries, Bro analyses the connections' TCP
semantics. The volume reported by the ``orig_size`` and ``resp_size``
fields represents TCP-level *throughput* and does not count packet
retransmissions. Likewise, the connection state reported as ``state``
is derived by closely following both endpoints' TCP state machines.
The following table summarizes the states:

.. include:: includes/conn-states-tcp.rst

The ``service`` field records Bro's understanding of what protocol a
connection is using, using a set of heuristics that consider both
payload and ports; see `dpd`_ for more information on how Bro derives
that field. 

Bro applies the term "connection" quite loosely not only to TCP
traffic but also to UDP flows. Accordingly, we can also generate
summaries for UDP traffic::

    > bro -r udp-flows.pcap conn
    > cat conn.log
    <XXX>

Each line corresponds to one UDP flow sharing the same 4-tuple of IP
addresses and ports. With UDP, the ``state`` field has a different
interpretation, per the following table:

.. include:: includes/conn-states-udp.rst


Bro can also generate summaries of ICMP traffic. However, since ICMP
does not have clear flow semantics, this functionality is activated
separately by loading :script:`icmp.bro` script; and accordingly it
logs into ``icmp.log``::

    > bro -r icmp-flows.pcap icmp
    > cat icmp.log

XXX TODO: Explain ICMP XXX

.. _netflow:
.. sidebar:: How do Bro's connection summaries compare with NetFlow?

    Bla Bla Bla.

.. _dpd:
.. sidebar:: How does Bro know the protocol?

    .. todo:: We describe this here with assuming DPD and
       seeing-all-packets is the default. We still need to decide
       whether we want to make that change. 



See local_nets later. 

Application-layer Logs
^^^^^^^^^^^^^^^^^^^^^^

.. todo:: Waiting with these until we have our new file formats. 

HTTP
++++

FTP
++++

SMTP
++++


Customizing Bro
---------------

.. _site policy:


Building a Site Policy
~~~~~~~~~~~~~~~~~~~~~~

Where to put it. 

Internal parameters, vs. script-level options.

.. _notice-policy:

Notice Policy
~~~~~~~~~~~~~


Two layered approach to alarms: activity that is potentially
relevant; and activity that is escalated into something important.

The first are Notices, and scripts generally flag them quite
liberally. Many of them will be uninteresting during operation, but
it's up to the user to decide. Show notice.log

Alarms are escalated notices. Show alarm.log. By default, all
notices are escalated, but you can tune. 


.. todo:: Diagram: [network activity] ---scripts---> [notices] ---policy---> alarms


.. _shell-scripts:




Testing the script role: :script:`conn.log`. 

Testing the Bro macro: |Bro|.


