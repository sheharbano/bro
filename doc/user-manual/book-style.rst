
Guidelines For Writing
======================

.. note: ReST Documentation. 

   http://docutils.sourceforge.net/rst.html


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
    
* Do not use any other inline markup.

Paragraph Markup
~~~~~~~~~~~~~~~~




Writing Style 
-------------

* Use active voice and present tense.

* Speak directly to the the reader: "click any file to open it."

* Cross-references.

  - To chapters/sections.
  
  - To Figures.

* Citations.

Figures
-------

For now, just draw preliminary figures conveying the main pieces,
using whatever program you prefer. Do not spend much time on
polishing optics, we need to settle on a single style eventually
anyway. 





