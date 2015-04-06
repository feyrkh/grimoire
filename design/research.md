# Research
## Study Precepts
Study known [precepts](precept.md) to receive research notes and xp. Studying is much easier if you have experience with the component
precepts.
        
## Synthesize Precepts
Uncover new [precepts](precept.md) by combining existing ones. Theories have a chance
to be uncovered by a researcher who is studying for research notes for one of the components and also has all of the prereqs.

## Create Theorems From Precepts
[Theorems](theorem.md) are combination of one or more [precepts](precept.md) which are given direction by a
[argument](argument.md) which directs the energies.

While studying precepts to produce research notes, a researcher has a chance to produce an unproven theorem if there
are any unknown theorems with this precept as a prerequisite. The chance of uncovering a theorem starts at a base %, 
and is modified as follows:
* x 0.5 for each precept the researcher doesn't know, but has been uncovered
* x 0 if there are any precepts the researcher doesn't know and haven't been uncovered by anyone at the university
* x 1.2 for each theorem that has been uncovered and is linked in the [theorem map](theorem_map.md)

For example, if you have a diagram like this:
[gimmick:yuml (type: 'activity')](`fire´->`unknown´->`water´)
then you could connect them with the 'energy' precept, which is made of fire and air. Then you could connect
place the 'air' [precept](precept.md) next to 'energy'. Finally, connect 'air' and 'water' with the 'mist' precept.

[gimmick:yuml (type: 'activity')](`fire´->`energy´->`air´->`mist´->`water´)

This might unlock the 'steam' precept. Each [precept](precept.md) placed requires one research point for that precept. A precept's
difficulty to learn/use is based on the the [precepts](precept.md) it is built on. This means that an inefficient [precept](precept.md) may be
harder to learn/use than an elegantly formulated one. For this reason, multiple instances of a [precept](precept.md) may be
researched in an attempt to find a more elegant solution. Obsolete [precepts](precept.md) may be deleted, or
might be kept around if they're easier for certain types of mage.

The difficulty of a [precept](precept.md) is calculated per-mage. It starts at 0. For the example
given above, it would look like this for a particular mage who does not know 'mist' or 'water', but has 2 xp in 'fire', 
1 xp in 'energy' and 1 xp 'air'.

    1. Does he know fire? Yes. Fire difficulty + 1 (1)
    2. Does he know energy? Yes. Energy difficulty + 1 (1)
    3. Does he know air? Yes. Air difficulty + 1 (1)
    4. Does he know mist? No. Break mist into its component parts until it reaches its axioms, add these as difficulty.
        Air difficulty + 1 (2), Water difficulty + 1 (1)
    5. Does he know water? No. Water dificulty + 1 (2)
    6. Final difficulty is the sum of all difficulties, minus mage's xp in those [precepts](precept.md) (min 0 per precept):
        Fire contribution: max(0, fire diff (1) - fire xp (2)) = 0
        Energy contribution: max(0, energy diff (1) - energy xp (1)) = 0
        Air contribution: max (0, air diff (2) - air xp (1)) = 1
        Water contribution: max(0, water diff (2) - water xp (0)) = 2
        Total difficulty: 0 + 0 + 1 + 2 = 3

