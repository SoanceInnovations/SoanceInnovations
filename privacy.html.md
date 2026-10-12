# PRIVACY STATEMENT

Source: https://www.soance.com/privacy.html

## S3 Camera Privacy Policy

Publisher: Soance Innovations LLP. Effective date: October 12, 2026.

S3 Camera uses your camera to take photos and videos. Microphone permission is optional and is used for video audio. The app does not write captures to your phone's shared gallery. Captures are temporarily held in the app's private storage while waiting for upload, including when a transfer fails or network access is unavailable. From version 1.0.8, a video that you start while Camera is visible can continue after pressing Home or locking the screen. A silent foreground recording notification provides Pause/Resume and Stop controls; allow notifications to see these controls in the notification shade. Returning to Camera reconnects to the same recording. Android camera and microphone privacy indicators remain active. Recording never starts automatically on reboot, and Android privacy controls or battery restrictions may interrupt it.

From version 1.0.4, the app sends photos, videos and any recorded audio over HTTPS to a fixed Amazon S3 bucket operated by Soance Innovations LLP. This is a shared cloud library: everyone using this app can view and archive uploaded captures. A notice before capture explains this sharing and asks you to continue. The app reads this bucket to display the shared gallery and moves deleted captures from the media folder to an archive folder. AWS processes this content under the publisher's AWS account settings and applicable AWS terms. Earlier configurable versions use the bucket selected by their user.

From version 1.0.9, shared server credentials are fetched over HTTPS from a publisher-configured, publicly accessible endpoint and cached in app-local storage encrypted with Android Keystore. The keys are not packaged in this version's APK. If fetching fails, a previously saved valid cache can still be used; without a valid cache, shared uploads are skipped and captures only use available user-enabled destinations. If none are available, captures remain in app-local storage and are not retrospectively sent to a newly available destination. Shared server failures do not display error messages in the app. The shared-upload switch still controls whether captures go to the server. Anyone can retrieve the credentials from the public endpoint and use their permissions to read, upload and archive shared media. They currently expire on January 10, 2027, and do not grant permanent object-version deletion or bucket configuration access. The access key identifier is sent to AWS in authenticated requests. The app has no advertising or analytics SDKs and does not request location, contacts, or shared photo-library access.

From version 1.0.5, Storage settings also lets you add and select other Amazon S3 buckets. From version 1.0.6, you can also configure Google Cloud Storage with HMAC credentials and Cloudflare R2 with S3 API credentials, and enable several destinations at once. Shared cloud uploads can be switched off independently. Captures go to the destinations enabled when capture starts, and local completed files are removed only after all of those uploads are verified. Disabling a destination pauses its pending transfers; enabling it resumes them. The camera screen includes a simple shared-upload disclosure, and the app does not display the publisher bucket name or credentials. These AWS credentials and settings are encrypted on your device using Android Keystore. The app sends captured media and authenticated requests directly over HTTPS to your enabled storage destinations; additional bucket credentials are not sent to Soance or an analytics service. Changing destinations affects future captures; pending captures keep their original destination. Access and retention in an additional bucket depend on its owner and provider permissions. The built-in bucket remains a shared library. Network encryption protects request contents, but does not hide connection metadata or prevent inspection on a device someone controls.

The app removes local completed capture files after verifying successful upload. Failed and interrupted captures can remain locally to prevent loss. Uninstalling the app removes its private local data and settings; it does not remove objects from S3.

Gallery deletion archives a capture in a separate folder. It does not permanently delete the content. Versioning can retain previous object versions and delete markers. The bucket owner controls permanent deletion, retention, access permissions, and lifecycle rules through AWS; these actions are not available in the app. Camera and microphone permissions can be revoked in Android settings.

This app is a general-purpose camera utility and is not directed to children. Changes to this policy should be published at the same public policy URL.

Contact: rajilesh@soance.com.

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
