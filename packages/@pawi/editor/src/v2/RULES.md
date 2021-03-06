# (1) Type in left element rule

This rule makes it simple to understand what happens when we type or delete after or before styled text.

Typing right before styled text ==> not styled (type in left element).
Typing right after styled text ==> styled (type in left element = styled element)

# (2) Zero character elements

These are allowed right after typing "cmd+b" for example. If no typing occured in element, it is deleted
when selection is moved.

# (3) First descendant of paragraph

We allow selection at position 0 since there is no direct previous text element.

# (4) Anchor position

Rules (1) to (3) imply that unless we have a zero width character element or a paragraph, we
never set selection to anchorOffset 0.

# (5) Selection in String or Custom

Selection anchor and focus can only happen in StringElement or CustomElemnt (not in GroupElement)

# (6) Selection direction

Selection anchor is always before focus in composition.

# (7) Cannot apply style to root paragraphs

We must first create a sub-paragraph.