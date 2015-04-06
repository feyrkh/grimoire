# Theorem Map
All of the theorems are linked together in a web. The links in the map are randomly generated for each game, 
based on the affinity between theorems, the number of already existing links. Example:

T1: P1 + P2
T2: P1 + P3
T3: P1 + P2 + P3
T4: P3 + P4

Base = Base weight. In this example, 1.2.
Aff(Tx, Ty) = Affinity between Tx and Ty. Used as the exponent for the base weight.
Complex(Tx) = Number of precepts involved in the theorem. Ex, Complex(T1) = 2, Complex(T3) = 3
Links(Tx) = Number of links between Tx and any other theorems. Each link reduces the chance of a new link by a fixed multiplier. 
LinkPenalty = The fixed multiplier for reducing likelihood of new links on a placed theorem.
Placed = The list of all theorems that have been placed on the map.
Rnd(List) = Pick a random item from the list.
Rnd(List, Weight) = Pick a random item from the list, weighted by the Weight function.

0. Place all theorems on the map with no links.
1. Pick Rnd(Placed, LinkPenalty^Links(Tx)) as the first item. Choosing a small (<1) LinkPenalty makes linear webs more likely.
    A LinkPenalty of 1 means there's no weighting - a chaotic web is likely to result. A LinkPenalty of >1 is likely to
    cause a smaller number of hubs with many spokes leading off it.  In this instance we're using LinkPenalty = 0.9.
    **Chose T2**
2. Pick Rnd(Placed - T2, Aff(T2, Ty) * LinkPenalty^Links(Ty) * (1-Abs(1/Complex(T2) - 1/Complex(Ty)))).
3. Repeat 1 & 2 until all theorems are reachable from the starting point