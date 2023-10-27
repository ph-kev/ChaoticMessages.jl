# ChaoticMessages.jl: Encrypting messages using chaos 

## Introduction 

Chaotic systems are known for their sensitivity to initial conditions. Two trajectories that start close together can diverge from each other. Despite this, Pecora and Carroll (1990) discovered that a pair of chaotic systems can synchronize with each other, so that the trajectories are eventually the same in time [1]. 

Cuomo, Oppenheim, and Strogatz studied a pair of dynamical systems based on the Lorenz system and use it to encrypt messages in the field of communications [2, 3, 4]. In particular, they have shown that the pair of dynamical systems do synchronize and the rate of synchronization is exponential, built an algorithm to send secret messages, and how noise can affect the quality of transmission. However, their implementation is built using circuits. 

This package simulates the chaotic dynamical systems using `DifferentialEquations.jl` to illustrate how secret messages can be sent using chaos. In particular, messages are sent secretly by embedding them into the trajectory of the chaotic dynamical system and binary messages are sent secretly using parameter modulation. 

## Getting Started: Installation
```julia 
julia> ]

(@v1.8) pkg> add https://github.com/ph-kev/ChaoticMessages.jl
```

## Examples

Comprehensive examples are available to show how to use this package. This is available here on the sidebar. 

Furthermore, the same tutorials are also available as `Jupyter` notebooks in the [`examples`](https://github.com/ph-kev/ChaoticMessages.jl/tree/main/examples) directory.

# References 
[1] Louis M. Pecora and Thomas L. Carroll. “Synchronization in chaotic systems”. In: Phys. Rev. Lett. 64 (8 Feb. 1990), pp. 821–824. doi: 10.1103/PhysRevLett.64.821. url: https://link.aps.org/doi/10.1103/PhysRevLett.64.821.

[2] Kevin M. Cuomo and Alan V. Oppenheim. “Circuit implementation of synchronized chaos with applications to communications”. In: Phys. Rev. Lett. 71 (1 July 1993), pp. 65–68. doi:10.1103/PhysRevLett.71.65. url: https://link.aps.org/doi/10.1103/PhysRevLett.71.65.

[3] K.M. Cuomo, A.V. Oppenheim, and S.H. Strogatz. “Synchronization of Lorenz-based chaotic circuits with applications to communications”. In: IEEE Transactions on Circuits and Systems II: Analog and Digital Signal Processing 40.10 (1993), pp. 626–633. doi: 10.1109/82.246163

[4] K.M. Cuomo, A.V. Oppenheim, and S.H. Strogatz. “Robustness and Signal Recovery in a Synchronized Chaotic System”. In: International Journal of Bifurcation and Chaos 03.06 (1993), pp. 1629–1638. doi: 10.1142/S021812749300129X. url: https://doi.org/10.1142/S021812749300129X.