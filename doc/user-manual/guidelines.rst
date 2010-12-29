
===================================
Guidelines For Writing The Bro Book
===================================

reST Documentation
------------------

See `here <http://docutils.sourceforge.net/rst.html>`_.

Markup
------

Inline Markup
~~~~~~~~~~~~~

* Use ``*text*`` for *emphasis*::

     This is *really* important. 

* Use ````cmdline```` for ``command lines`` and literal
  input/output::
  
      Run it as ``bro mt``. The output is ``Foo``.

* For names of programs, define a macro in ``main.rst`` and use that::

    .. |Bro| replace:: *Bro*
    
    [...]
    
    This is a book about |Bro|. 

* For names of existing Bro scripts, use the ``script`` role
  (defined in ``main.rst``)::
  
     Do not forget to load :script:`conn.log`.
    
*Rule of thumb*: Do not use any other inline markup. If you find
yourself needing something else, first add a description to the list
above, so that others will use it in the same way. Consider using 
semantical markup in the form of new roles, such as the ``script``
role described above. 

Paragraph Markup
~~~~~~~~~~~~~~~~

To mark to-do items, use the ``todo`` directive::

    .. todo:: Still need to fix the example.

See ``docutils/todo.py`` for an example how to add custom directives. 

Writing Style 
-------------

* Use active voice and present tense.

* Speak directly to the the reader: "click any file to open it."

* Cross-references.

  - TODO: to chapters/sections.
  
  - TODO: to Figures.

* TODO: Citations.

Figures
-------

For now, just draw preliminary figures conveying the main pieces,
using whatever program you prefer. Do not spend time on polishing,
we need to settle on a single style eventually anyway. 

Exercises
---------

We should add a set of exercises to each chapter (or section where
appropiate). These exercises should demonstrate the main lessons
learned in the corresponding discussion, usually using trace files
that we provide online. Please also provide a sample solution (this
won't be going into the book, but we can use them for example for
future workshops).

* TODO: Come up with some templete markup for the exercises and
  solutions. 










