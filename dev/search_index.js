var documenterSearchIndex = {"docs":
[{"location":"convergence/#Synchronization-of-chaotic-dynamical-systems","page":"Convergence","title":"Synchronization of chaotic dynamical systems","text":"","category":"section"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"An example of a synchronized chaotic system is given by ","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"beginalign*\ndotx_T = sigma (y_T - x_T)  \ndoty_T = rx_T - y_T - 20 x_T z_T  \ndotz_T = 5 x_T y_T - bz_T\nendalign*","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"which is the transmitter's dynamical system and ","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"beginalign*\ndotx_R = sigma (y_R - x_R)  \ndoty_R = rx_T - y_R - 20 x_T z_R  \ndotz_R = 5 x_T y_R - bz_R\nendalign*","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"which is the receiver's dynamical system. These pair of systems can be used to send secret messages. ","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"We give a numerical example of synchronization and the error between the x-component of the transmitter's dynamical system and the x-component of the receiver's dynamical system going to zero.","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"We first find the solution to the transmitter's dynamical system with parameters sigma = 16, r=456, and b=4 with initial condition 160 40 456. ","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"using ChaoticMessages\nusing Plots\nusing DifferentialEquations\nusing LaTeXStrings\nusing Measures \n\nu0 = [2.2,1.3,2.0] # initial conditions \np = [16.0;4.0;45.6] # parameters \ntspan = (0,15.0) # time span \n\n# Set up the ODE problem (for lorenz_transmitter!) and solve it \nprob_T = ODEProblem(lorenz_transmitter!, u0, tspan, p)\nsol_transmitter = solve(prob_T, AutoTsit5(Rodas4P()), abstol = 1e-11, reltol = 1e-11)\n\n# Plot only the x-component of the solution for transmitter's dynamical system \ntransmitter_plot = plot(sol_transmitter, idxs = (0, 1), legend = false, xaxis=L\"t\", yaxis=\"Transmitter\",linecolor=\"black\", left_margin=10mm, bottom_margin=10mm)","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"Next, we find the solution to the receiver's dynamical system with the same parameters sigma = 16, r=456, and b=4 as before, but with different initial condition 1027360. Also, notice that in the definition of the receiver's system, we are using x_T which is the x-component of the transmitter's dynamical system. Hence, the receiver's dynamical system have information of the x-component of the solution to the transmitter's dynamical system.","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"# Get only the x-component of the solution \nx_at_time_t_transmitter(t) = sol_transmitter(t,idxs=1) \n\nu0 = [10.2,7.3,6.0] # Different intial conditions \n\nreceiver! = lorenz_receiver!(x_at_time_t_transmitter)\n\n# Set up the ODE problem (for lorenz_receiver!) and solve it \nprob_R = ODEProblem(receiver!, u0, tspan, p) # reusing the same parameters \nsol_receiver = solve(prob_R, AutoTsit5(Rodas4P()), abstol = 1e-11, reltol = 1e-11)\n\n# Plot only the x-component of the solution for receiver's dynamical system \nreceiver_plot = plot(sol_receiver, idxs = (0, 1), legend = false, xaxis=L\"t\", yaxis=\"Receiver\", linecolor=\"black\", left_margin=10mm, bottom_margin=10mm)","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"Lastly, we plot the absolute error between the x-component of the receiver's dynamical system and the transmitter's dynamical system. We see that the error converge to zero which means the pair of dynamical system synchronize for the x-component despite starting at different initial conditions. Also, it has been shown that the error converge to zero exponentially in time. The idea behind sending secret messages using chaotic dynamical systems is to encode a message in x_T and having the receiver's dynamical system reproduce the message by its synchronization! ","category":"page"},{"location":"convergence/","page":"Convergence","title":"Convergence","text":"# Get only the x-component of the solution \nx_at_time_t_receiver(t) = sol_receiver(t,idxs=1) \n\n# Plot the errors and the x-component of the solutions \nabs_error = error_set_up(x_at_time_t_transmitter, x_at_time_t_receiver)\n\nerror_plot = plot(abs_error, tspan..., legend = false, xaxis=L\"t\", yaxis=L\"E(t)\",linecolor=\"red\")\nx_coord_plot = plot(x_at_time_t_transmitter, tspan...,label=\"Transmitter\",xaxis=L\"t\",yaxis=L\"x(t)\")\nplot!(x_at_time_t_receiver, tspan...,label=\"Receiver\")\n\ncombined_plot = plot(x_coord_plot, error_plot, dpi=600, left_margin=10mm, bottom_margin=10mm)","category":"page"},{"location":"sending_a_binary_message/#Sending-a-secret-binary-message-using-chaotic-dynamical-systems","page":"Sending a secret binary message","title":"Sending a secret binary message using chaotic dynamical systems","text":"","category":"section"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"In this tutorial, we explore how to send binary messages secretly using chaos. To do this, we will use parameter modulation where b varies with time. The pair of chaotic dynamical systems will only synchronize if the values of b are the same between both of them. Otherwise, the error will be non-zero. ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"using ChaoticMessages\nusing Plots\nusing DifferentialEquations\nusing LaTeXStrings\nusing Measures","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"We first encode a binary string as a function of time. If the binary digit is 0, then the result is b_zero = 4.0 and if the binary digit is 1, then the result is b_one = 4.4. Each digit is spaced by a time interval of t=20. Anything else that do not correspond to any of the position of the binary string is mapped to the value of b_zero. ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"message_unencrypted = binary_to_bmessage(\"101010\"; )\nprintln(message_unencrypted(0.0)) # first position of the string \nprintln(message_unencrypted(2.0)) # second position of the string \nprintln(message_unencrypted(4.0)) # third position of the string \nprintln(message_unencrypted(6.0)) # fourth position of the string \nprintln(message_unencrypted(14.0)) # correspond to no position of the string \nprintln(message_unencrypted(-1.0)) # correspond to no position of the string ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"We now use this in the transmitter's chaotic system which is given by ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"beginalign*\ndotx_T = sigma (y_T - x_T)  \ndoty_T = rx_T - y_T - 20 x_T z_T  \ndotz_T = 5 x_T y_T - b(t)z_T\nendalign*","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"Notice that b(t) is a function of time now. This is the parameter modulation. ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"The x-component of the trajectory is plotted, and we see that the message is encrypted.","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"u0 = [2.2, 1.3, 2.0] # initial conditions \np = [16.0, 4.0, 45.6] # parameters (second value is ignored for now)\ntspan = (0.0, 12.0) # time span \n\nsecret_message = create_secret_message(\n    u0,\n    p,\n    tspan,\n    message_unencrypted,\n    binary = true,\n)\n\n# Plot x-component of the solution to the transmitter's dynamical system \nplot(secret_message, tspan..., xticks = 0:2:12, legend = false, xaxis=L\"t\", yaxis=\"Transmitter\",linecolor=\"black\", left_margin=10mm, bottom_margin=10mm)","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"To decrypt the secret message, we use the receiver's dynamical system which is ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"beginalign*\ndotx_R = sigma (y_R - x_R)  \ndoty_R = rx_T - y_R - 20 x_T z_R  \ndotz_R = 5 x_T y_R - bz_R\nendalign*","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"If b=40, then the parameters match and synchronization occurs and if b=44, then the parameters mismatch and synchronization does not occur. The result of decrypt_secret_message is E(t) = (x_T - x_R)^2 which is the difference between the x-component of the transmitter's solution and the x-component of the receiver's solution squared. If the error is close to zero, then the binary digit must be 0 and otherwise, the binary digit is 1. ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"In the plot below, the regions in red correspond to the binary digit 1 and the regions in blue correspond to the binary digit 0. ","category":"page"},{"location":"sending_a_binary_message/","page":"Sending a secret binary message","title":"Sending a secret binary message","text":"# result is the difference between the x_T and x_R squared\nerror = decrypt_secret_message(\n    u0,\n    p,\n    tspan,\n    secret_message,\n    binary = true\n)\n\n# Plot the error \np = plot(error, tspan..., xticks = 0:2:12, xaxis=L\"t\", yaxis=\"Error\",linecolor=\"black\", left_margin=10mm, bottom_margin=10mm)\n\nfor i in [0, 4, 8]\n    vspan!(p, [i, i + 2], linecolor = :red, fillcolor = :red, fillalpha = 0.2, legend = false)\nend \nfor i in [2, 6, 10]\n    vspan!(p, [i, i + 2], linecolor = :blue, fillcolor = :blue, fillalpha = 0.2, legend = false)\nend \ncurrent() # update plot ","category":"page"},{"location":"sending_a_message/#Sending-a-secret-message-using-chaotic-dynamical-systems","page":"Sending a secret message","title":"Sending a secret message using chaotic dynamical systems","text":"","category":"section"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"For this tutorial, we will learn how messages can be sent secretly using a chaotic dynamical system. Consider two people: Transmitter and Receiver. Transmitter want to send a message m(t) to Receiver. However, the message should not be able to be read by anyone, but the Receiver. Cuomo and Oppenheim show that one way of approaching this problem is by using synchronized chaotic system [1]. The core idea is to send the sum of the message m(t) and the trajectory of the transmitter's dynamical system, use the receiver's dynamical system to reproduce the actual trajectory of the transmitter's dynamical system, and use this to directly compute m(t).","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"In the cell below, we encoded a secret message which is audio of a taunt from Monty Python into the x-component of the trajectory of the transmitter's dynamical system which is ","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"beginalign*\ndotx_R = sigma (y_R - x_R)  \ndoty_R = rx_T - y_R - 20 x_T z_R  \ndotz_R = 5 x_T y_R - bz_R\nendalign*","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"using ChaoticMessages\nusing WAV\nusing Plots\nusing DifferentialEquations\nusing LaTeXStrings\nusing Random\nusing Measures \n\nu0 = [2.2,1.3,2.0] # initial condition\np = [16.0, 4.0, 45.6] # parameters of the dynamical system \ntspan = (0.0,4.0) # length of the message is 4 seconds \n\n# Create unscaled secret message \nunencrypted_message, num_samples, sampling_rate = convert_message_to_samples(\"../audio/taunt.wav\")\nunscaled_secret_message = create_secret_message(u0, p, tspan, unencrypted_message, scale = 0.4)\nno_message = create_secret_message(u0, p, tspan, (t) -> 0.0)\n\n# Plotting unscaled secret message \ntime_arr = range(tspan..., length = 100000)\nplot(time_arr, unscaled_secret_message, xaxis=L\"t\", yaxis=L\"x(t)\", label = \"Secret message embedded\", color = \"lightblue\", left_margin=10mm, bottom_margin=10mm)\nplot!(time_arr, no_message, label = \"No message embedded\", color = \"darkorange\")","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"The first step is to create an encrypted message widetildem(t) = x_T (t) + m(t) where the magnitude of m(t) is much smaller than the magnitude of x_T(t). This encrypts the message m(t) because x_T(t) serve as a mask to hide the message m(t). Note that m(t) can be made as small as we like by multiplying by 0  varepsilon  1. The receiver can multiply by frac1varepsilon to get m(t) back when the receiver recovers the scaled version of m(t). The value of varepsilon is determined the keyword argument scale = 1e-5 in create_secret_message. ","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"### Transmitter ###\n# Create secret message \nunencrypted_message, num_samples, sampling_rate = convert_message_to_samples(\"../audio/taunt.wav\")\nsecret_message = create_secret_message(u0, p, tspan, unencrypted_message)\n\n# Convert secret message to WAV file \nconvert_samples_to_message(secret_message, sampling_rate, num_samples, \"../audio/tauntSecret.wav\")","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"The second step is to send the encrypted message widetildem(t) which is a .wav file to the receiver and the third step is to use widetildem(t) to reproduce x_T(t). Note that in this case, the message m(t) is noise as the receiver's dynamical system try to synchronize with widetildem(t). The receiver's dynamical system will not perfectly recover x_T(t) because of the noise m(t). The error will also not go to zero because of this. The receiver's dynamical system is ","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"beginalign*\ndotx_R = sigma (y_R-x_R) \ndoty_R = r  widetildem(t) - y_R - 20 (widetildem(t)   z_R)\ndotz_R = 5 widetildem(t) y_R - b  z_R\nendalign*","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"where x_R is replaced by widetildem except for the equation for dotx_R. Since widetildem(t) = x_T(t) + m(t) and x_T(t) approx x_R(t), we compute widetildem(t) - x_R(t) approx x_T (t) + m(t) - x_T(t) = m(t) which give us the recovered message! ","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"### Receiver ###\n# Get secret message \nsecret_message, num_samples, sampling_rate = convert_message_to_samples(\"../audio/tauntSecret.wav\")\n\n# Decrpyt message \ndecrypted_message = decrypt_secret_message(u0, p, tspan, secret_message)\n\n# Convert secret_message to a wav file \nconvert_samples_to_message(decrypted_message, sampling_rate, num_samples, \"../audio/tauntDecrpyted.wav\")","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"To examine its effectiveness, we look at the error between unencrypted_message and decrypted_message and see that the error fluctuates at around 001 which is enough to listen to the message faithfully. ","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"# Plot error between original sound file and decrypted sound file \nabs_error = error_set_up(unencrypted_message, decrypted_message)\nerror_plot = plot(abs_error, tspan..., legend = false, xaxis=L\"t\", yaxis=L\"E(t)\", color = \"red\", linewidth=0.5)\n\n# Plot unencrypted message and encrypted message \nsound_plot = plot(unencrypted_message,tspan...,label=\"Original\", xaxis=L\"t\", yaxis=\"Amplitude\", color = \"blue\", linewidth=0.1, left_margin=10mm, bottom_margin=10mm)\nplot!(sound_plot, decrypted_message,tspan...,label=\"Recovered\", linewidth=1.5, linealpha=0.3, color = \"green\")\ncombined_plot = plot(sound_plot, error_plot, dpi = 900)\n\ncombined_plot","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"Noise can be added to the message to test whether this form of encryption is robust to noise or not. We tested it for sigma = 01 05 10 20. The message is still recovered, but is masked with static noise. For a large sigma, the message cannot be heard because of the static noise. ","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"Random.seed!(42424242) # set seed \n\nmessage_unencrypted, _, _ = convert_message_to_samples(\"../audio/taunt.wav\")\n\nerror_plot = plot(left_margin=10mm, bottom_margin=10mm)\n# plot error for various levels of standard deviation \nfor s in [2.0, 1.0, 0.5, 0.1] \n    # Create secret message \n    message_unencrypted_noisy, num_samples, sampling_rate = convert_message_to_samples(\"../audio/taunt.wav\", add_noise = true, std = s)\n    secret_message = create_secret_message(u0, p, tspan, message_unencrypted_noisy)\n\n    # Convert secret message to WAV file \n    convert_samples_to_message(secret_message, sampling_rate, num_samples, \"../audio/tauntSecret.wav\")\n\n    ### Receiver ###\n    # Get secret message \n    secret_message, num_samples, sampling_rate = convert_message_to_samples(\"../audio/tauntSecret.wav\")\n\n    # Decrpyt message \n    decrypted_message = decrypt_secret_message(u0, p, tspan, secret_message)\n\n    # Convert secret_message to a wav file \n    convert_samples_to_message(decrypted_message, sampling_rate, num_samples, \"../audio/tauntDecrpyted-\" * string(s) * \".wav\")\n\n    # Plot the error \n    abs_error = error_set_up(message_unencrypted, decrypted_message)\n    \n    plot!(abs_error, tspan..., xaxis=L\"t\", yaxis=L\"E(t)\", labels = L\"\\sigma = \" * string(s), palette = :seaborn_colorblind, linewidth = 0.5, dpi = 600)\n  end \n\nerror_plot","category":"page"},{"location":"sending_a_message/","page":"Sending a secret message","title":"Sending a secret message","text":"[1] Kevin M. Cuomo and Alan V. Oppenheim. “Circuit implementation of synchronized chaos with applications to communications”. In: Phys. Rev. Lett. 71 (1 July 1993), pp. 65–68. doi:10.1103/PhysRevLett.71.65. url: https://link.aps.org/doi/10.1103/PhysRevLett.71.65","category":"page"},{"location":"#ChaoticMessages.jl:-Encrypting-messages-using-chaos","page":"Home","title":"ChaoticMessages.jl: Encrypting messages using chaos","text":"","category":"section"},{"location":"#Introduction","page":"Home","title":"Introduction","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Chaotic systems are known for their sensitivity to initial conditions. Two trajectories that start close together can diverge from each other. Despite this, Pecora and Carroll (1990) discovered that a pair of chaotic systems can synchronize with each other, so that the trajectories are eventually the same in time [1]. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"Cuomo, Oppenheim, and Strogatz studied a pair of dynamical systems based on the Lorenz system and use it to encrypt messages in the field of communications [2, 3, 4]. In particular, they have shown that the pair of dynamical systems do synchronize and the rate of synchronization is exponential, built an algorithm to send secret messages, and how noise can affect the quality of transmission. However, their implementation is built using circuits. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"This package simulates the chaotic dynamical systems using DifferentialEquations.jl to illustrate how secret messages can be sent using chaos. In particular, messages are sent secretly by embedding them into the trajectory of the chaotic dynamical system and binary messages are sent secretly using parameter modulation. ","category":"page"},{"location":"#Getting-Started:-Installation","page":"Home","title":"Getting Started: Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"julia> ]\n\n(@v1.8) pkg> add https://github.com/ph-kev/ChaoticMessages.jl","category":"page"},{"location":"#Examples","page":"Home","title":"Examples","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Comprehensive examples are available to show how to use this package. This is available here on the sidebar. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"Furthermore, the same tutorials are also available as Jupyter notebooks in the examples directory.","category":"page"},{"location":"#References","page":"Home","title":"References","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"[1] Louis M. Pecora and Thomas L. Carroll. “Synchronization in chaotic systems”. In: Phys. Rev. Lett. 64 (8 Feb. 1990), pp. 821–824. doi: 10.1103/PhysRevLett.64.821. url: https://link.aps.org/doi/10.1103/PhysRevLett.64.821.","category":"page"},{"location":"","page":"Home","title":"Home","text":"[2] Kevin M. Cuomo and Alan V. Oppenheim. “Circuit implementation of synchronized chaos with applications to communications”. In: Phys. Rev. Lett. 71 (1 July 1993), pp. 65–68. doi:10.1103/PhysRevLett.71.65. url: https://link.aps.org/doi/10.1103/PhysRevLett.71.65.","category":"page"},{"location":"","page":"Home","title":"Home","text":"[3] K.M. Cuomo, A.V. Oppenheim, and S.H. Strogatz. “Synchronization of Lorenz-based chaotic circuits with applications to communications”. In: IEEE Transactions on Circuits and Systems II: Analog and Digital Signal Processing 40.10 (1993), pp. 626–633. doi: 10.1109/82.246163","category":"page"},{"location":"","page":"Home","title":"Home","text":"[4] K.M. Cuomo, A.V. Oppenheim, and S.H. Strogatz. “Robustness and Signal Recovery in a Synchronized Chaotic System”. In: International Journal of Bifurcation and Chaos 03.06 (1993), pp. 1629–1638. doi: 10.1142/S021812749300129X. url: https://doi.org/10.1142/S021812749300129X.","category":"page"},{"location":"documentation/#Documentation","page":"Documentation","title":"Documentation","text":"","category":"section"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"Pages = [\"documentation.md\"]","category":"page"},{"location":"documentation/#Functions","page":"Documentation","title":"Functions","text":"","category":"section"},{"location":"documentation/#Converting","page":"Documentation","title":"Converting","text":"","category":"section"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"convert_message_to_samples(\n    message::String;\n    add_noise::Bool = false,\n    std::Float64 = 1.0,\n)","category":"page"},{"location":"documentation/#ChaoticMessages.convert_message_to_samples-Tuple{String}","page":"Documentation","title":"ChaoticMessages.convert_message_to_samples","text":"convert_message_to_samples(\n    message::String;\n    add_noise::Bool = false,\n    std::Float64 = 1.0,\n)\n\nArguments\n\nmessage::String : filepath to the wav file to convert to samples \nadd_noise::Bool : if true, add Gaussian noise of standard deviation std and none otherwise \nstd::Float64 : standard deviation of Gaussian noise if add_noise is true\n\nReturns\n\nfunc_message_unencrypted : waveform that is a function of time \nnum_samples : number of samples \nsampling_rate : sampling rate \n\nConvert a message (.wav file) which is identified as the string of the file path  and convert it into samples. If add_noise is true, then noise is added to the samples.  The noise is generated from a Gaussian distribution with mean 0 and standard deviation  std`.\n\n\n\n\n\n","category":"method"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"convert_samples_to_message(\n    samples,\n    sampling_rate,\n    num_of_samples::Int64,\n    name_of_file::String,\n)","category":"page"},{"location":"documentation/#ChaoticMessages.convert_samples_to_message-Tuple{Any, Any, Int64, String}","page":"Documentation","title":"ChaoticMessages.convert_samples_to_message","text":"convert_samples_to_message(\n    samples,\n    sampling_rate,\n    num_of_samples::Int64,\n    name_of_file::String,\n)\n\nArguments\n\nsamples : function that produce the samples \nsampling_rate : sampling rate of the resulting file \nnum_of_samples::Int64 : number of samples of the resulting file \nname_of_file::String : name of the resulting file \n\nConvert samples into a wav file and save it. \n\n\n\n\n\n","category":"method"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"binary_to_bmessage(\n    s::String;\n    time_length::Float64 = 2.0,\n    b_zero::Float64 = 4.0,\n    b_one::Float64 = 4.4,\n)","category":"page"},{"location":"documentation/#ChaoticMessages.binary_to_bmessage-Tuple{String}","page":"Documentation","title":"ChaoticMessages.binary_to_bmessage","text":"binary_to_bmessage(\n    s::String;\n    time_length::Float64 = 2.0,\n    b_zero::Float64 = 4.0,\n    b_one::Float64 = 4.4,\n)\n\nArguments\n\ns::String : binary string of 0's and 1's  \ntime_length::Float64 = 2.0 : time between each binary digit \nb_zero::Float64 = 4.0 : value of the function when the binary digit is zero \nb_one::Float64 = 4.4 : value of the function when the binary digit is one \n\nReturn a function that map the time t to floor(t/time_length)th position of the binary string. The binary digits in the string is counted starting with 0. If t < 0 or  t >= time_length * length(binary_arr), then the function evaluate to b_zero.\n\n\n\n\n\n","category":"method"},{"location":"documentation/#Encrypting","page":"Documentation","title":"Encrypting","text":"","category":"section"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"create_secret_message(\n    u0::Vector{Float64},\n    p::Vector{Float64},\n    tspan::Union{Tuple{Float64,Float64},Vector{Float64}},\n    message_unencrypted;\n    binary::Bool = false,\n    scale::Float64 = 1e-5,\n    abstol::Float64 = 1e-11,\n    reltol::Float64 = 1e-11,\n)","category":"page"},{"location":"documentation/#ChaoticMessages.create_secret_message-Tuple{Vector{Float64}, Vector{Float64}, Union{Tuple{Float64, Float64}, Vector{Float64}}, Any}","page":"Documentation","title":"ChaoticMessages.create_secret_message","text":"create_secret_message(\n    u0::Vector{Float64},\n    p::Vector{Float64},\n    tspan::Union{Tuple{Float64,Float64},Vector{Float64}},\n    message_unencrypted;\n    binary::Bool = false,\n    scale::Float64 = 1e-5,\n    abstol::Float64 = 1e-11,\n    reltol::Float64 = 1e-11,\n)\n\nArguments\n\nu0::Vector{Float64}: initial condition of the Lorenz system \np::Vector{Float64}: parameters of the Lorenz system \ntspan::Union{Tuple{Float64, Float64}, Vector{Float64}} : length of the message \nmessage_unencrypted : function that produces the message that is to be encrpyted\nbinary::Bool = false : indicates whether the message being encrpyted is binary or not \nscale::Float64 = 1e-5 : scaling factor for the secret message \nabstol::Float64 = 1e-11 : absolute tolerance for the ODE solver \nreltol::Float64 = 1e-11 : relative tolerance for the ODE solver \n\nEncrpyt the message using a paramterized version of the Lorenz system  (see lorenz_transmitter! and lorenz_transmitter_binary!).  \n\n\n\n\n\n","category":"method"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"decrypt_secret_message(\n    u0::Vector{Float64},\n    p::Vector{Float64},\n    tspan::Union{Tuple{Float64,Float64},Vector{Float64}},\n    secret_message;\n    binary::Bool = false,\n    scale::Float64 = 1e5,\n    abstol::Float64 = 1e-11,\n    reltol::Float64 = 1e-11,\n)","category":"page"},{"location":"documentation/#ChaoticMessages.decrypt_secret_message-Tuple{Vector{Float64}, Vector{Float64}, Union{Tuple{Float64, Float64}, Vector{Float64}}, Any}","page":"Documentation","title":"ChaoticMessages.decrypt_secret_message","text":"decrypt_secret_message(\n    u0::Vector{Float64},\n    p::Vector{Float64},\n    tspan::Union{Tuple{Float64,Float64},Vector{Float64}},\n    secret_message;\n    binary::Bool = false,\n    scale::Float64 = 1e5,\n    abstol::Float64 = 1e-11,\n    reltol::Float64 = 1e-11,\n)\n\nArguments\n\nu0::Vector{Float64}: initial condition of the variation of the Lorenz system \np::Vector{Float64}: parameters of the variation of the Lorenz system \ntspan::Union{Tuple{Float64, Float64}, Vector{Float64}} : length of the message \nsecret_message : function that produces the secret message that is to be decrypted \nbinary::Bool = false : indicates whether the message being decrypted is binary or not \nscale::Float64 = 1e-5 : scaling factor for the recovered message \nabstol::Float64 = 1e-11 : absolute tolerance for the ODE solver \nreltol::Float64 = 1e-11 : relative tolerance for the ODE solver \n\nDecrypt the message using a paramterized version of the Lorenz system (lorenz_receiver!).  \n\n\n\n\n\n","category":"method"},{"location":"documentation/#Chaotic-Systems","page":"Documentation","title":"Chaotic Systems","text":"","category":"section"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"lorenz_transmitter!(du, u, p, t)","category":"page"},{"location":"documentation/#ChaoticMessages.lorenz_transmitter!-NTuple{4, Any}","page":"Documentation","title":"ChaoticMessages.lorenz_transmitter!","text":"lorenz_transmitter!(du, u, p, t)\n\nDefine the parameterized Lorenz system which is used to transmit messages. \n\nThe system of differential equations is -\n\ndotx_T = sigma (y_T - x_T)\n\ndoty_T = rx_T - y_T - 20 x_T z_T\n\ndotz_T = 5x_T y_T - b z_T\n\n\n\n\n\n","category":"method"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"lorenz_receiver!(secret_message)","category":"page"},{"location":"documentation/#ChaoticMessages.lorenz_receiver!-Tuple{Any}","page":"Documentation","title":"ChaoticMessages.lorenz_receiver!","text":"lorenz_receiver!(secret_message)\n\nDefine the parameterized Lorenz system which is used to receive the encrpyted message. \n\nThe system of differential equations is -\n\ndotx_R = sigma (y_R - x_R)\n\ndoty_R = r cdot m(t) - y_R - 20 (m(t) cdot z_R)\n\ndotz_R = 5 (m(t) cdot y_R) - b cdot z_R\n\n\n\n\n\n","category":"method"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"lorenz_transmitter_binary!(du, u, p, t)","category":"page"},{"location":"documentation/#ChaoticMessages.lorenz_transmitter_binary!-NTuple{4, Any}","page":"Documentation","title":"ChaoticMessages.lorenz_transmitter_binary!","text":"lorenz_transmitter_binary!(du, u, p, t)\n\nDefine the parameterized Lorenz system which is used to transmit binary messages. \n\nThe system of differential equations is -\n\ndotx_T = sigma (y_T - x_T)\n\ndoty_T = rx_T - y_T - 20 x_T z_T\n\ndotz_T = 5x_T y_T - b(t) z_T\n\nNotice that the only difference between lorenz_transmitter! and  lorenz_transmitter_binary! is that b is a function of time. \n\n\n\n\n\n","category":"method"},{"location":"documentation/#Index","page":"Documentation","title":"Index","text":"","category":"section"},{"location":"documentation/","page":"Documentation","title":"Documentation","text":"","category":"page"}]
}