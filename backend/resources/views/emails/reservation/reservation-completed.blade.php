<!DOCTYPE html>
<html>
<head>
    <title>Service Completed Successfully</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #ECF0F1;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            /* Green gradient for success */
            background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
            padding: 40px 30px;
            text-align: center;
            color: #FFFFFF;
        }
        
        .header-icon {
            font-size: 60px;
            margin-bottom: 20px;
        }
        
        .header-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #2C3E50;
            margin-bottom: 15px;
        }
        
        .highlight {
            color: #2ECC71;
            font-weight: 700;
        }
        
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            background-color: #F8F9F9;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .details-table th, .details-table td {
            padding: 15px;
            text-align: left;
            font-size: 15px;
            border-bottom: 1px solid #ECF0F1;
        }
        
        .details-table th {
            background-color: #ECF0F1;
            color: #34495E;
            font-weight: 600;
            width: 35%;
        }
        
        .details-table td {
            color: #2C3E50;
            font-weight: 500;
        }

        .cta-container {
            text-align: center;
            margin: 35px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
            color: #FFFFFF !important;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
            transition: transform 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4);
        }

        .review-prompt {
            background: rgba(46, 204, 113, 0.1); /* Light green background */
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
        }
        
        .review-prompt h3 {
            color: #27AE60;
            margin-top: 0;
            font-size: 18px;
        }
        
        .email-footer {
            background-color: #2C3E50;
            padding: 30px;
            text-align: center;
            color: #FFFFFF;
        }
        
        .footer-text {
            margin: 5px 0;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ECF0F1;
        }
        
        .signature-name {
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 5px;
        }
        
        .signature-team {
            color: #7F8C8D;
            font-size: 14px;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 14px 30px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="header-icon">🎉</div>
            <h1 class="header-title">Service Completed!</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            {{-- Use the $client variable for the greeting --}}
            <div class="greeting">Hello {{ $client->name }},</div>
            
            <p class="message">
                We're happy to confirm that your reservation for the service: **<strong>{{ $reservation->service->title }}</strong>** has been successfully **<strong>completed</strong>c**!
            </p>
            
            <p class="message">
                Your experience with **<strong>{{ $reservation->service->provider->name }}</strong>** is now finalized. Thank you for using our platform!
            </p>

            <table class="details-table">
                <thead>
                    <tr>
                        <th colspan="2" style="background-color: #ECF0F1; text-align: center; font-size: 16px;">
                            Completed Booking Details
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Service Booked</th>
                        <td>{{ $reservation->service->title }}</td>
                    </tr>
                    <tr>
                        <th>Date Completed</th>
                        {{-- Assuming 'date' is a relevant completion date field on the reservation model, or use Carbon's now() if the mail sends immediately --}}
                        <td>{{ \Carbon\Carbon::parse($reservation->date)->format('F d, Y \a\t h:i A') }}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td class="highlight">{{ $reservation->service->price }} DH</td>
                    </tr>
                </tbody>
            </table>

            <!-- Review Prompt -->
            <div class="review-prompt">
                <h3>Tell Us About Your Experience!</h3>
                <p class="message" style="margin-bottom: 20px;">
                    Did **<strong>{{ $reservation->service->provider->name }}</strong>** meet your expectations? Your review helps other clients choose the best service.
                </p>
                <!-- CTA Button - Review Route -->
                <div class="cta-container" style="margin: 0;">
                    {{-- Assuming a route to leave a review for the service/reservation --}}
                    <a href="{{ config('app.url') }}/client/dashboard/reservations/{{ $reservation->id }}/review" class="cta-button" style="padding: 12px 30px;">Leave a Review Now</a>
                </div>
            </div>
            
            <p class="message" style="margin-top: 25px;">
                If you have any further questions or need assistance, please feel free to reach out to our support team.
            </p>
            
            <!-- Signature -->
            <div class="signature">
                <div class="signature-name">We appreciate your business,</div>
                <div class="signature-team">The {{ config('app.name') }} Team</div>
            </div>
        </div>
        
        <!-- Footer (No links, maintaining consistency) -->
        <div class="email-footer">
            <div class="footer-text">{{ config('app.name') }} - Your Platform Name</div>
            
            <div class="footer-text" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
