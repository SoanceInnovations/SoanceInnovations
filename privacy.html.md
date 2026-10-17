# PRIVACY STATEMENT

Source: https://www.soance.com/privacy.html

## S3 Camera / S3 Cloud Camera Privacy Policy

Publisher: Soance Innovations LLP. Effective date: October 17, 2026. This section describes Android S3 Camera version 1.0.13 and later, and iOS S3 Cloud Camera version 1.0.0 and later. These releases use only storage destinations configured by the user. The legacy Android behavior is described below for people who have not updated.

The app uses your camera to take photos and videos. Microphone access is optional and is used for video audio; denying it permits silent video. Captures are held in app-private local storage and are not written to the device's shared photo library. The app does not request location or contacts, and includes no advertising or analytics SDKs.

You can configure multiple Amazon S3, Cloudflare R2, and Google Cloud Storage destinations and enable or disable each independently. The app sends captures and authenticated storage requests directly over HTTPS to the destinations enabled when capture starts. Credentials are stored on your device using Android Keystore encryption on Android and Keychain on iOS. The current releases contain no built-in storage destination, do not fetch publisher access keys or secrets, and do not upload captures or your provider credentials to a Soance-operated storage server. The library displays only your configured destinations. Access to uploaded objects depends on the account, bucket and provider permissions you configure.

If no destination is enabled, captures stay in app-private storage and are not retrospectively sent to a destination enabled later. Completed local files are removed only after every selected destination verifies its upload. A failed transfer can leave its capture locally until retry succeeds. Pending transfers retain their original capture-time destinations; disabling a destination pauses its pending transfers and enabling it resumes them. Removing a destination does not delete objects already stored by its provider. Background uploads are scheduled by the operating system and can be delayed by network availability, battery restrictions, force-stop or force-quit.

On Android, a video that you start while Camera is visible can continue when you press Home or lock the screen. A silent foreground recording notification provides Pause/Resume and Stop controls; allow notifications to see these controls in the notification shade. Android camera and microphone privacy indicators remain active. Recording continues until you stop it or device storage reaches a safety reserve, at which point the app finalizes and saves the video where possible. Long recordings can be saved as separate segments to avoid file-size limits. Recording does not start automatically from the background, after reboot or after a process kill. Device privacy controls, interruptions, resource pressure and manufacturer battery policies can stop recording.

On iOS, video recording requires the app to remain in the foreground. Leaving the app stops and finalizes recording; background upload tasks can continue when iOS permits. Camera and microphone permissions can be changed in the device settings on either platform.

Library deletion archives a capture in a separate provider folder instead of permanently deleting it. AWS versioning can retain previous object versions and delete markers. The bucket owner controls permanent deletion, access, retention and lifecycle rules through the storage provider. Uninstalling the app removes its private local capture files and settings but does not remove uploaded objects; device credential storage can have separate platform retention behavior.

HTTPS protects request contents in transit. Storage providers receive media, authentication information and connection metadata needed to process your requests under their terms and your account settings. Network encryption does not hide connection metadata or prevent inspection on a device someone controls.

Legacy Android versions 1.0.4 through 1.0.12 included a publisher-operated shared S3 destination with a capture disclosure. Other users of those versions could view and archive shared uploads. From version 1.0.9, that destination fetched public endpoint credentials and could use an encrypted local cache. Updating to version 1.0.13 removes that destination, its saved credentials and shared-upload preferences, and stops its pending upload attempts. The update does not delete media previously uploaded by older versions or change the permissions of those existing objects. Older configurable releases also support user-selected destinations. Update the app to use the current user-configured-only behavior.

This app is a general-purpose camera utility and is not directed to children. Policy changes are published at this public URL. Contact: rajilesh@soance.com.

## Website privacy statement

WHAT DO WE DO WITH YOUR INFORMATION?

When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address and email address.

When you browse our store, we also automatically receive your computer’s internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.

Email marketing (if applicable): With your permission, we may send you emails about our store, new products and other updates.

CONSENT

How do you get my consent?

When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.

If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.

How do I withdraw my consent?

If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at info@soance.com or mailing us at: I/478A,
                                    Pulliode, Kadirur,
                                    Kannur,
                                    Kerala,
                                    India - 670642

DISCLOSURE

We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.

PAYMENT

We use Razorpay for processing payments. We/Razorpay do not store your card data on their servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment. Your purchase transaction data is only used as long as is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is not saved.

Our payment gateway adheres to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover.

PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.

For more insight, you may also want to read terms and conditions of razorpay on https://razorpay.com

THIRD-PARTY SERVICES

In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.

However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.

For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.

In particular, remember that certain providers may be located in or have facilities that are located a different jurisdiction than either you or us. So if you elect to proceed with a transaction that involves the services of a third-party service provider, then your information may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located.

Once you leave our store’s website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website’s Terms of Service.

Links

When you click on links on our store, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.

SECURITY

To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.

COOKIES

We use cookies to maintain session of your user. It is not used to personally identify you on other Web Apps.

AGE OF CONSENT

By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.

CHANGES TO THIS PRIVACY POLICY

We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.

If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.

QUESTIONS AND CONTACT INFORMATION

If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer at If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at info@soance.com or mailing us at: I/478A,
                                        Pulliode, Kadirur,
                                        Kannur,
                                        Kerala,
                                        India - 670642 [Re: Privacy Compliance Officer]  ----

If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at info@soance.com or mailing us at: I/478A,
                                        Pulliode, Kadirur,
                                        Kannur,
                                        Kerala,
                                        India - 670642

[Re: Privacy Compliance Officer]



----
