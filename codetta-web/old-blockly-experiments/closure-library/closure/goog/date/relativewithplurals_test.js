// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('goog.date.relativeWithPluralsTest');
goog.setTestOnly('goog.date.relativeWithPluralsTest');

goog.require('goog.date.relative');
/** @suppress {extraRequire} Include shared tests. */
goog.require('goog.date.relativeTest');
/** @suppress {extraRequire} Included for side effects. */
goog.require('goog.date.relativeWithPlurals');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.i18n.DateTimeSymbols_bn'); // Bengali
goog.require('goog.i18n.DateTimeSymbols_en');
goog.require('goog.i18n.DateTimeSymbols_fa'); // Persian
goog.require('goog.i18n.NumberFormatSymbols');
goog.require('goog.i18n.NumberFormatSymbols_bn'); // Bengali
goog.require('goog.i18n.NumberFormatSymbols_en');
goog.require('goog.i18n.NumberFormatSymbols_fa'); // Persian


function tearDown() {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en;
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}

function testFormatRelativeForPastDatesPersianDigits() {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fa;
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fa;
  var fn = goog.date.relative.format;

  // The text here is English, as it comes from localized resources, not
  // from CLDR. It works properly in production, but it's not loaded here.
  // Will need to wait for CLDR 24, when the data we need will be available,
  // so that we can add it to DateTimeSymbols and out of localization.

  // For Persian \u06F0 is the base, so \u6F0 = digit 0, \u6F5 = digit 5 ...
  // "Western" digits in square brackets for convenience
  assertEquals('Should round seconds to the minute below',
      localizeNumber(0) + ' minutes ago',  // ?? minutes ago
      fn(timestamp('23 March 2009 14:30:10')));

  assertEquals('Should round seconds to the minute below',
      localizeNumber(1) + ' minute ago',  // ?? minute ago
      fn(timestamp('23 March 2009 14:29:56')));

  assertEquals('Should round seconds to the minute below',
      localizeNumber(2) + ' minutes ago',  // ?? minutes ago
      fn(timestamp('23 March 2009 14:29:00')));

  assertEquals(localizeNumber(10) + ' minutes ago',  // ???? minutes ago
      fn(timestamp('23 March 2009 14:20:10')));
  assertEquals(localizeNumber(59) + ' minutes ago',  // ???? minutes ago
      fn(timestamp('23 March 2009 13:31:42')));
  assertEquals(localizeNumber(2) + ' hours ago',  // ?? hours ago
      fn(timestamp('23 March 2009 12:20:56')));
  assertEquals(localizeNumber(23) + ' hours ago',  // ???? hours ago
      fn(timestamp('22 March 2009 15:30:56')));
  assertEquals(localizeNumber(1) + ' day ago',  // ?? day ago
      fn(timestamp('22 March 2009 12:11:04')));
  assertEquals(localizeNumber(1) + ' day ago',  // ?? day ago
      fn(timestamp('22 March 2009 00:00:00')));
  assertEquals(localizeNumber(2) + ' days ago',  // ?? days ago
      fn(timestamp('21 March 2009 23:59:59')));
  assertEquals(localizeNumber(2) + ' days ago',  // ?? days ago
      fn(timestamp('21 March 2009 10:30:56')));
  assertEquals(localizeNumber(2) + ' days ago',  // ?? days ago
      fn(timestamp('21 March 2009 00:00:00')));
  assertEquals(localizeNumber(3) + ' days ago',  // ?? days ago
      fn(timestamp('20 March 2009 23:59:59')));
}

function testFormatRelativeForFutureDatesBengaliDigits() {
  var fn = goog.date.relative.format;
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bn;
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bn;

  // For Bengali \u09E6 is the base, so \u09E6 = digit 0, \u09EB = digit 5
  // "Western" digits in square brackets for convenience
  assertEquals('Should round seconds to the minute below',
      'in ' + localizeNumber(1) + ' minute',  // in ??? minute
      fn(timestamp('23 March 2009 14:32:05')));

  assertEquals('Should round seconds to the minute below',
      'in ' + localizeNumber(2) + ' minutes',  // in ??? minutes
      fn(timestamp('23 March 2009 14:33:00')));

  assertEquals('in ' + localizeNumber(10) + ' minutes',  // in ?????? minutes
      fn(timestamp('23 March 2009 14:40:10')));
  assertEquals('in ' + localizeNumber(59) + ' minutes',  // in ?????? minutes
      fn(timestamp('23 March 2009 15:29:15')));
  assertEquals('in ' + localizeNumber(2) + ' hours',  // in ??? hours
      fn(timestamp('23 March 2009 17:20:56')));
  assertEquals('in ' + localizeNumber(23) + ' hours',  // in ?????? hours
      fn(timestamp('24 March 2009 13:30:56')));
  assertEquals('in ' + localizeNumber(1) + ' day',  // in ??? day
      fn(timestamp('24 March 2009 14:31:07')));
  assertEquals('in ' + localizeNumber(1) + ' day',  // in ??? day
      fn(timestamp('24 March 2009 16:11:04')));
  assertEquals('in ' + localizeNumber(1) + ' day',  // in ??? day
      fn(timestamp('24 March 2009 23:59:59')));
  assertEquals('in ' + localizeNumber(2) + ' days',  // in ??? days
      fn(timestamp('25 March 2009 00:00:00')));
  assertEquals('in ' + localizeNumber(2) + ' days',  // in ??? days
      fn(timestamp('25 March 2009 10:30:56')));
  assertEquals('in ' + localizeNumber(2) + ' days',  // in ??? days
      fn(timestamp('25 March 2009 23:59:59')));
  assertEquals('in ' + localizeNumber(3) + ' days',  // in ??? days
      fn(timestamp('26 March 2009 00:00:00')));
}

function localizeNumber(value) {
  // Quick conversion to national digits, to increase readability of the
  // tests above.
  return goog.i18n.DateTimeFormat.localizeNumbers(value);
}
