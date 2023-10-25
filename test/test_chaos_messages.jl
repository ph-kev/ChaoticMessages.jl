using Test
using ChaoticMessages
using WAV
using Statistics
using DifferentialEquations

@testset "ChaoticEncryption.jl" begin
    @testset "convert_message_to_samples" begin
        # Create a wave of period 1 and amplitude 0.1 and save it as "test.wav"
        sampling_rate1 = 8e3
        time_arr = 0.0:1/sampling_rate1:prevfloat(1.0)
        freq = 1
        y = sin.(2pi * freq * time_arr) * 0.1
        wavwrite(y, "test.wav", Fs = sampling_rate1)

        # Create functions and test if they are approximately equal 
        samples, num_samples, sampling_rate2 = convert_message_to_samples("test.wav")
        wave(t) = sin.(2pi * freq * t) * 0.1

        # the wav file is 1 seconds and the sampling rate is 8000 which means the
        # number of samples is 8000
        @test num_samples == 8000
        @test sampling_rate1 == sampling_rate2
        for t in time_arr
            @test isapprox(samples(t), wave(t), atol = 0.0001) == true
        end
    end

    @testset "convert_message_to_samples with noise" begin
        # Create the wave y = 1 and save it as "test1.wav"
        sampling_rate = 1e6
        time_arr = 0.0:1/sampling_rate:prevfloat(1.0)
        y = ones(size(time_arr))
        wavwrite(y, "test1.wav", Fs = sampling_rate)

        std = 4.2
        mean = 1.0
        wave, _, _ = convert_message_to_samples("test1.wav", add_noise = true, std = std)
        arr = wave.(time_arr)
        est_mean = Statistics.mean(arr)
        est_std = Statistics.std(arr)
        @test isapprox(est_mean, mean, atol = 0.1) == true
        @test isapprox(est_std, std, atol = 0.1) == true
    end

    @testset "convert_samples_to_message" begin
        sampling_rate = 8e3
        time_arr = 0.0:1/sampling_rate:prevfloat(1.0)
        freq = 1e3
        y = sin.(2pi * freq * time_arr) * 0.1
        wavwrite(y, "test3.wav", Fs = sampling_rate)

        # Test if convert_message_to_samples and convert_samples_to_message are inverses of each other  
        samples3, num_samples3, sampling_rate3 = convert_message_to_samples("test3.wav")
        convert_samples_to_message(samples3, sampling_rate3, num_samples3, "test4.wav")
        samples4, num_samples4, sampling_rate4 = convert_message_to_samples("test4.wav")

        # Test for number of samples, sampling rate, and samples themselves are the same 
        @test num_samples3 == num_samples4
        @test sampling_rate3 == sampling_rate4
        for t in time_arr
            @test isapprox(samples3(t), samples4(t))
        end
    end

    @testset "convergence" begin
        u0 = [2.2, 1.3, 2.0] # initial conditions 
        p = [16.0; 4.0; 45.6] # parameters 
        tspan = (0, 15.0) # time span 

        # Transmiter 
        # Set up the ODE problem (for lorenz_transmitter!) and solve it 
        prob_T = ODEProblem(lorenz_transmitter!, u0, tspan, p)
        sol_transmitter =
            solve(prob_T, AutoTsit5(Rodas4P()), abstol = 1e-11, reltol = 1e-11)

        # Get x-coordinate of transmitter's solution
        x_at_time_t_transmitter(t) = sol_transmitter(t, idxs = 1)

        # Receiver 
        u0 = [10.2, 7.3, 6.0] # Different intial conditions 
        receiver! = lorenz_receiver!(x_at_time_t_transmitter)

        # Set up the ODE problem (for lorenz_receiver!) and solve it 
        prob_R = ODEProblem(receiver!, u0, tspan, p) # reusing the same parameters 
        sol_receiver = solve(prob_R, AutoTsit5(Rodas4P()), abstol = 1e-11, reltol = 1e-11)

        # Test convergence for x, y, and z components of the solution 
        diff_error(t) = abs.(sol_transmitter(t) - sol_receiver(t))
        x_end, y_end, z_end = diff_error(15.0)
        @test x_end < 1e-10
        @test y_end < 1e-10
        @test z_end < 1e-10
    end

    @testset "create_secret_message" begin
        u0 = [2.2, 1.3, 2.0] # initial condition
        p = [16.0, 4.0, 45.6] # parameters of the dynamical system 
        tspan = (0.0, 1.0) # time interval of one second 

        # Define wave form 
        freq = 1e3
        y_wave(t) = sin(2pi * freq * t) * 0.1

        # Create unscaled secret message 
        unscaled_secret_message = create_secret_message(u0, p, tspan, y_wave, scale = 1.0)

        # Create message with nothing embedded in it 
        no_message = create_secret_message(u0, p, tspan, (t) -> 0.0, scale = 1.0)

        # Take the difference between the two messages 
        diff(t) = unscaled_secret_message(t) - no_message(t)

        # Test if the difference is approximately equal to the wave form for various values of t 
        time_arr = range(tspan..., 1000)
        for t in time_arr
            @test isapprox(y_wave(t), diff(t), atol = 1e-11)
        end
    end

    @testset "decrypt_secret_message" begin
        u0 = [2.2, 1.3, 2.0] # initial condition
        p = [16.0, 4.0, 45.6] # parameters of the dynamical system 
        tspan = (0.0, 10.0) # length of the message is 10 seconds 
        
        # Define waveform 
        freq = 1e3
        waveform(t) = sin(2pi * freq * t) * 10.0

        # Create unscaled secret message 
        secret_message = create_secret_message(u0, p, tspan, waveform, scale = 1e-7)

        # Decrpyt message 
        decrypted_message =
            decrypt_secret_message(u0, p, tspan, secret_message, scale = 1e7)

        # Calculate error between waveform and decrypted_message
        diff(t) = abs.(waveform(t) - decrypted_message(t))
        
        # Check if the error is less than 0.1 for values in time_arr 
        time_arr = range(0.0, 10.0, 1000)
        res = diff.(time_arr) .< 0.1
        @test ones(size(time_arr)) == res
    end

    @testset "binary_to_bmessage" begin
        @test_throws ErrorException("Only take binary strings of 0's and 1's") binary_to_bmessage("2")
        @test_throws ErrorException("Only take binary strings of 0's and 1's") binary_to_bmessage("12")
        @test_throws ErrorException("Only take binary strings of 0's and 1's") binary_to_bmessage("20")
        bmessage = binary_to_bmessage("10")
        @test bmessage(-1.0) == 4.0 
        @test bmessage(20.0) == 4.0 
        @test bmessage(0.0) == 4.4
        @test bmessage(1.0) == 4.4
        @test bmessage(2.0) == 4.0
        @test bmessage(3.0) == 4.0
    end 
end
