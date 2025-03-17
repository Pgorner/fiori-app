/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0050.commons.native"
],
function(oFF)
{
"use strict";

oFF.DateRangeGranularityMapper = {

	s_calendar:null,
	convertHalfYearToMonthLowerBound:function(halfYear)
	{
			return halfYear <= 1 ? 1 : 7;
	},
	convertHalfYearToMonthUpperBound:function(halfYear)
	{
			return halfYear <= 1 ? 6 : 12;
	},
	convertMonthToHalfYear:function(month)
	{
			return month > 6 ? 2 : 1;
	},
	convertQuarterToMonthLowerBound:function(quarter)
	{
			return quarter <= 1 ? 1 : quarter === 2 ? 4 : quarter === 3 ? 7 : 10;
	},
	convertQuarterToMonthUpperBound:function(quarter)
	{
			return quarter <= 1 ? 3 : quarter === 2 ? 6 : quarter === 3 ? 9 : 12;
	},
	getLastDayInMonth:function(year, month)
	{
			try
		{
			if (oFF.isNull(oFF.DateRangeGranularityMapper.s_calendar))
			{
				oFF.DateRangeGranularityMapper.s_calendar = oFF.XGregorianCalendar.create();
			}
			return oFF.DateRangeGranularityMapper.s_calendar.getDaysInMonth(year, month);
		}
		catch (e)
		{
			return 1;
		}
	},
	mapToDate:function(date, granularity, useUpperBound)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(date) && oFF.notNull(granularity))
		{
			if (granularity === oFF.DateRangeGranularity.DAY)
			{
				return oFF.XDate.createDateSafe(date);
			}
			let strSize = oFF.XString.size(date);
			if (granularity === oFF.DateRangeGranularity.YEAR)
			{
				let year = strSize === 4 ? oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(date, 0, 4), -1) : -1;
				if (year > 999)
				{
					return useUpperBound ? oFF.XDate.createDateWithValues(year, 12, 31) : oFF.XDate.createDateWithValues(year, 1, 1);
				}
			}
			else if (granularity === oFF.DateRangeGranularity.HALF_YEAR && strSize === 5)
			{
				let yearHY = oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(date, 0, 4), -1);
				let halfYear = oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(date, 4, 5), -1);
				if (yearHY > 999 && (halfYear === 1 || halfYear === 2))
				{
					if (useUpperBound)
					{
						let monthHY = oFF.DateRangeGranularityMapper.convertHalfYearToMonthUpperBound(halfYear);
						return oFF.XDate.createDateWithValues(yearHY, monthHY, oFF.DateRangeGranularityMapper.getLastDayInMonth(yearHY, monthHY));
					}
					return oFF.XDate.createDateWithValues(yearHY, oFF.DateRangeGranularityMapper.convertHalfYearToMonthLowerBound(halfYear), 1);
				}
			}
			else if (granularity === oFF.DateRangeGranularity.QUARTER && strSize === 5)
			{
				let yearQ = oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(date, 0, 4), -1);
				let quarter = oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(date, 4, 5), -1);
				if (yearQ > 999 && quarter > 0 && quarter < 5)
				{
					if (useUpperBound)
					{
						let monthQ = oFF.DateRangeGranularityMapper.convertQuarterToMonthUpperBound(quarter);
						return oFF.XDate.createDateWithValues(yearQ, monthQ, oFF.DateRangeGranularityMapper.getLastDayInMonth(yearQ, monthQ));
					}
					return oFF.XDate.createDateWithValues(yearQ, oFF.DateRangeGranularityMapper.convertQuarterToMonthLowerBound(quarter), 1);
				}
			}
			else if (granularity === oFF.DateRangeGranularity.MONTH && strSize === 6)
			{
				let yearM = oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(date, 0, 4), -1);
				let month = oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(date, 4, 6), -1);
				if (yearM > 999 && month > 0 && month < 13)
				{
					return oFF.XDate.createDateWithValues(yearM, month, useUpperBound ? oFF.DateRangeGranularityMapper.getLastDayInMonth(yearM, month) : 1);
				}
			}
		}
		return null;
	},
	mapToString:function(date, granularity)
	{
			if (oFF.notNull(date) && oFF.notNull(granularity))
		{
			if (granularity === oFF.DateRangeGranularity.YEAR)
			{
				return oFF.XString.substring(date.toSAPFormat(), 0, 4);
			}
			if (granularity === oFF.DateRangeGranularity.HALF_YEAR)
			{
				let year1 = oFF.XString.substring(date.toSAPFormat(), 0, 4);
				let halfYear = date.getQuarterOfYear() === 1 || date.getQuarterOfYear() === 2 ? "1" : "2";
				return oFF.XStringUtils.concatenate2(year1, halfYear);
			}
			if (granularity === oFF.DateRangeGranularity.QUARTER)
			{
				let year2 = oFF.XString.substring(date.toSAPFormat(), 0, 4);
				let quarter = oFF.XInteger.convertToString(date.getQuarterOfYear());
				return oFF.XStringUtils.concatenate2(year2, quarter);
			}
			if (granularity === oFF.DateRangeGranularity.MONTH)
			{
				return oFF.XString.substring(date.toSAPFormat(), 0, 6);
			}
			if (granularity === oFF.DateRangeGranularity.DAY)
			{
				return date.toSAPFormat();
			}
		}
		return null;
	}
};

oFF.XCalendarUtils = {

	isGregorianLeapYear:function(yearIn)
	{
			if (oFF.XCalendarUtils.isValidGregorianDate(yearIn, 12, 31))
		{
			if (oFF.XMath.mod(yearIn, 400) === 0)
			{
				return true;
			}
			if (oFF.XMath.mod(yearIn, 100) === 0)
			{
				return false;
			}
			return oFF.XMath.mod(yearIn, 4) === 0;
		}
		throw oFF.XException.createIllegalArgumentException("Not a Valid Gregorian Data");
	},
	isValidGregorianDate:function(year, oneBasedMonth, day)
	{
			if ((year < 1582 || year > 9999) && year !== 1000)
		{
			return false;
		}
		if (year === 1582)
		{
			if (oneBasedMonth < 10 || oneBasedMonth === 10 && day < 15)
			{
				return false;
			}
		}
		return true;
	}
};

oFF.XDateRange = function() {};
oFF.XDateRange.prototype = new oFF.XObject();
oFF.XDateRange.prototype._ff_c = "XDateRange";

oFF.XDateRange.create = function(dateTimeProvider)
{
	let dateRange = new oFF.XDateRange();
	dateRange.m_dateTimeProvider = dateTimeProvider;
	return dateRange;
};
oFF.XDateRange.prototype.m_dateTimeProvider = null;
oFF.XDateRange.prototype.m_fixedFromDate = null;
oFF.XDateRange.prototype.m_fixedToDate = null;
oFF.XDateRange.prototype.m_from = null;
oFF.XDateRange.prototype.m_granularity = null;
oFF.XDateRange.prototype.m_isFixedRange = false;
oFF.XDateRange.prototype.m_lookAhead = null;
oFF.XDateRange.prototype.m_lookBack = null;
oFF.XDateRange.prototype.m_offset = null;
oFF.XDateRange.prototype.m_to = null;
oFF.XDateRange.prototype.m_upToCurrentPeriod = false;
oFF.XDateRange.prototype.cloneExt = function(flags)
{
	let clone = oFF.XDateRange.create(this.m_dateTimeProvider);
	clone.m_granularity = this.m_granularity;
	clone.m_isFixedRange = this.m_isFixedRange;
	clone.m_upToCurrentPeriod = this.m_upToCurrentPeriod;
	if (oFF.notNull(this.m_fixedFromDate))
	{
		clone.m_fixedFromDate = oFF.XDate.createWithMillis(this.m_fixedFromDate.getMilliseconds());
	}
	if (oFF.notNull(this.m_fixedToDate))
	{
		clone.m_fixedToDate = oFF.XDate.createWithMillis(this.m_fixedToDate.getMilliseconds());
	}
	if (oFF.notNull(this.m_offset))
	{
		clone.m_offset = oFF.XPair.create(this.m_offset.getFirstObject(), this.m_offset.getSecondObject());
	}
	if (oFF.notNull(this.m_lookBack))
	{
		clone.m_lookBack = oFF.XPair.create(this.m_lookBack.getFirstObject(), this.m_lookBack.getSecondObject());
	}
	if (oFF.notNull(this.m_lookAhead))
	{
		clone.m_lookAhead = oFF.XPair.create(this.m_lookAhead.getFirstObject(), this.m_lookAhead.getSecondObject());
	}
	return clone;
};
oFF.XDateRange.prototype.compute = function()
{
	if (oFF.isNull(this.m_from) || oFF.isNull(this.m_to))
	{
		if (this.m_isFixedRange)
		{
			if (oFF.notNull(this.m_fixedFromDate))
			{
				try
				{
					this.m_from = oFF.XGregorianCalendar.create();
					this.m_from.setTimeInMillis(this.m_fixedFromDate.getMilliseconds());
				}
				catch (e1)
				{
					this.m_from = null;
				}
			}
			if (oFF.notNull(this.m_fixedToDate))
			{
				try
				{
					this.m_to = oFF.XGregorianCalendar.create();
					this.m_to.setTimeInMillis(this.m_fixedToDate.getMilliseconds());
				}
				catch (e2)
				{
					this.m_to = null;
				}
			}
		}
		else
		{
			let timezoneOffset = oFF.notNull(this.m_dateTimeProvider) ? this.m_dateTimeProvider.getLocalTimezoneOffset() : oFF.XSystemUtils.getSystemTimezoneOffsetInMilliseconds();
			let timeZone = oFF.XSimpleTimeZone.createWithOffsetAndId(timezoneOffset, "");
			let timeInMillis = oFF.notNull(this.m_dateTimeProvider) ? this.m_dateTimeProvider.getCurrentTimeInMilliseconds() : oFF.XSystemUtils.getCurrentTimeInMilliseconds();
			this.m_from = oFF.XGregorianCalendar.createWithTimeZone(timeZone);
			this.m_from.setTimeInMillis(timeInMillis);
			this.m_to = oFF.XGregorianCalendar.createWithTimeZone(timeZone);
			this.m_to.setTimeInMillis(timeInMillis);
			if (oFF.notNull(this.m_offset))
			{
				let offsetField = this.mapGranularityToField(this.m_offset.getFirstObject());
				let offset = this.m_offset.getSecondObject().getInteger();
				this.m_from.add(offsetField, offset);
				this.m_to.add(offsetField, offset);
			}
			if (oFF.notNull(this.m_lookBack) && (oFF.isNull(this.m_granularity) || !this.m_granularity.isCurrentDateUnit()))
			{
				this.m_from.add(this.mapGranularityToField(this.m_lookBack.getFirstObject()), this.m_lookBack.getSecondObject().getInteger() * (-1));
			}
			if (oFF.notNull(this.m_lookAhead) && !this.m_upToCurrentPeriod && (oFF.isNull(this.m_granularity) || !this.m_granularity.isCurrentDateUnit()))
			{
				this.m_to.add(this.mapGranularityToField(this.m_lookAhead.getFirstObject()), this.m_lookAhead.getSecondObject().getInteger());
			}
		}
		this.computeGranularity();
	}
};
oFF.XDateRange.prototype.computeGranularity = function()
{
	if (oFF.notNull(this.m_granularity) && this.m_granularity !== oFF.DateRangeGranularity.DAY)
	{
		if (oFF.notNull(this.m_from))
		{
			this.m_from.setField(oFF.DateConstants.DAY_OF_MONTH, 1);
			if (this.m_granularity.isYear())
			{
				this.m_from.setField(oFF.DateConstants.MONTH, oFF.DateConstants.JANUARY);
			}
			if (this.m_granularity.isHalfYear())
			{
				let fromMonthHalfYear = this.m_from.get(oFF.DateConstants.MONTH);
				let firstMonthInHalfYear = fromMonthHalfYear <= 6 ? 1 : 7;
				this.m_from.setField(oFF.DateConstants.MONTH, firstMonthInHalfYear);
			}
			if (this.m_granularity.isQuarter())
			{
				let fromMonth = this.m_from.get(oFF.DateConstants.MONTH);
				let firstMonthInQuarter = fromMonth <= 3 ? 1 : fromMonth <= 6 ? 4 : fromMonth <= 9 ? 7 : 10;
				this.m_from.setField(oFF.DateConstants.MONTH, firstMonthInQuarter);
			}
		}
		if (this.m_granularity.isCurrentDateUnit())
		{
			return;
		}
		if (!this.m_upToCurrentPeriod && oFF.notNull(this.m_to))
		{
			if (this.m_granularity.isYear())
			{
				this.m_to.setField(oFF.DateConstants.MONTH, oFF.DateConstants.DECEMBER);
				this.m_to.setField(oFF.DateConstants.DAY_OF_MONTH, 31);
			}
			if (this.m_granularity.isHalfYear())
			{
				let toMonthHalfYear = this.m_to.get(oFF.DateConstants.MONTH);
				let lastMonthInHalfYear = toMonthHalfYear <= 6 ? 6 : 12;
				this.m_to.setField(oFF.DateConstants.DAY_OF_MONTH, this.m_to.getDaysInMonth(this.m_to.get(oFF.DateConstants.YEAR), lastMonthInHalfYear));
				this.m_to.setField(oFF.DateConstants.MONTH, lastMonthInHalfYear);
			}
			if (this.m_granularity.isQuarter())
			{
				let toMonth = this.m_to.get(oFF.DateConstants.MONTH);
				let lastMonthInQuarter = toMonth <= 3 ? 3 : toMonth <= 6 ? 6 : toMonth <= 9 ? 9 : 12;
				this.m_to.setField(oFF.DateConstants.DAY_OF_MONTH, this.m_to.getDaysInMonth(this.m_to.get(oFF.DateConstants.YEAR), lastMonthInQuarter));
				this.m_to.setField(oFF.DateConstants.MONTH, lastMonthInQuarter);
			}
			else if (this.m_granularity.isMonth())
			{
				this.m_to.setField(oFF.DateConstants.DAY_OF_MONTH, this.m_to.getDaysInMonth(this.m_to.get(oFF.DateConstants.YEAR), this.m_to.get(oFF.DateConstants.MONTH)));
			}
		}
	}
};
oFF.XDateRange.prototype.getDateTimeProvider = function()
{
	return this.m_dateTimeProvider;
};
oFF.XDateRange.prototype.getFixedFromDate = function()
{
	return this.m_fixedFromDate;
};
oFF.XDateRange.prototype.getFixedToDate = function()
{
	return this.m_fixedToDate;
};
oFF.XDateRange.prototype.getFromDate = function()
{
	this.compute();
	return oFF.notNull(this.m_from) ? oFF.XDate.createDateWithValues(this.getFromValue(oFF.DateRangeGranularity.YEAR), this.getFromValue(oFF.DateRangeGranularity.MONTH), this.getFromValue(oFF.DateRangeGranularity.DAY)) : null;
};
oFF.XDateRange.prototype.getFromValue = function(granularity)
{
	let field = this.mapGranularityToField(granularity);
	if (field !== -1)
	{
		this.compute();
		if (oFF.notNull(this.m_from))
		{
			return this.m_from.get(field);
		}
	}
	return -1;
};
oFF.XDateRange.prototype.getGranularity = function()
{
	return this.m_granularity;
};
oFF.XDateRange.prototype.getLookAhead = function()
{
	return this.m_lookAhead;
};
oFF.XDateRange.prototype.getLookBack = function()
{
	return this.m_lookBack;
};
oFF.XDateRange.prototype.getOffset = function()
{
	return this.m_offset;
};
oFF.XDateRange.prototype.getToDate = function()
{
	this.compute();
	return oFF.notNull(this.m_to) ? oFF.XDate.createDateWithValues(this.getToValue(oFF.DateRangeGranularity.YEAR), this.getToValue(oFF.DateRangeGranularity.MONTH), this.getToValue(oFF.DateRangeGranularity.DAY)) : null;
};
oFF.XDateRange.prototype.getToValue = function(granularity)
{
	let field = this.mapGranularityToField(granularity);
	if (field !== -1)
	{
		this.compute();
		if (oFF.notNull(this.m_to))
		{
			return this.m_to.get(field);
		}
	}
	return -1;
};
oFF.XDateRange.prototype.isFixedRange = function()
{
	return this.m_isFixedRange;
};
oFF.XDateRange.prototype.isUpToCurrentPeriod = function()
{
	return this.m_upToCurrentPeriod;
};
oFF.XDateRange.prototype.mapGranularityToField = function(granularity)
{
	if (oFF.notNull(granularity) && !granularity.isCurrentDateUnit())
	{
		if (granularity.isYear())
		{
			return oFF.DateConstants.YEAR;
		}
		if (granularity.isHalfYear())
		{
			return oFF.DateConstants.HALF_YEAR;
		}
		if (granularity.isQuarter())
		{
			return oFF.DateConstants.QUARTER;
		}
		if (granularity.isMonth())
		{
			return oFF.DateConstants.MONTH;
		}
		if (granularity.isDay())
		{
			return oFF.DateConstants.DAY_OF_MONTH;
		}
	}
	return -1;
};
oFF.XDateRange.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.resetDates();
	this.m_dateTimeProvider = null;
	this.m_granularity = null;
	this.m_fixedFromDate = oFF.XObjectExt.release(this.m_fixedFromDate);
	this.m_fixedToDate = oFF.XObjectExt.release(this.m_fixedToDate);
	this.m_offset = oFF.XObjectExt.release(this.m_offset);
	this.m_lookBack = oFF.XObjectExt.release(this.m_lookBack);
	this.m_lookAhead = oFF.XObjectExt.release(this.m_lookAhead);
};
oFF.XDateRange.prototype.resetDates = function()
{
	this.m_from = oFF.XObjectExt.release(this.m_from);
	this.m_to = oFF.XObjectExt.release(this.m_to);
};
oFF.XDateRange.prototype.withFixDates = function(fromDate, toDate)
{
	this.resetDates();
	this.m_fixedFromDate = fromDate;
	this.m_fixedToDate = toDate;
	this.m_isFixedRange = true;
	this.m_upToCurrentPeriod = false;
	return this;
};
oFF.XDateRange.prototype.withGranularity = function(granularity, upToCurrentPeriod)
{
	this.resetDates();
	this.m_granularity = granularity;
	this.m_upToCurrentPeriod = upToCurrentPeriod && !this.m_isFixedRange;
	return this;
};
oFF.XDateRange.prototype.withLookAhead = function(granularity, lookAhead)
{
	this.resetDates();
	if (this.mapGranularityToField(granularity) !== -1 && lookAhead >= 0)
	{
		this.m_lookAhead = oFF.XPair.create(granularity, oFF.XIntegerValue.create(lookAhead));
	}
	else
	{
		this.m_lookAhead = null;
	}
	return this;
};
oFF.XDateRange.prototype.withLookBack = function(granularity, lookBack)
{
	this.resetDates();
	if (this.mapGranularityToField(granularity) !== -1 && lookBack >= 0)
	{
		this.m_lookBack = oFF.XPair.create(granularity, oFF.XIntegerValue.create(lookBack));
	}
	else
	{
		this.m_lookBack = null;
	}
	return this;
};
oFF.XDateRange.prototype.withOffset = function(granularity, offset)
{
	this.resetDates();
	if (this.mapGranularityToField(granularity) !== -1)
	{
		this.m_offset = oFF.XPair.create(granularity, oFF.XIntegerValue.create(offset));
	}
	else
	{
		this.m_offset = null;
	}
	return this;
};

oFF.XDateTimeUtils = {

	compareDate:function(firstDate, secondDate)
	{
			let yearCompare = oFF.XDateTimeUtils.compareInts(firstDate.getYear(), secondDate.getYear());
		if (yearCompare !== 0)
		{
			return yearCompare;
		}
		let monthCompare = oFF.XDateTimeUtils.compareInts(firstDate.getMonthOfYear(), secondDate.getMonthOfYear());
		if (monthCompare !== 0)
		{
			return monthCompare;
		}
		return oFF.XDateTimeUtils.compareInts(firstDate.getDayOfMonth(), secondDate.getDayOfMonth());
	},
	compareDateTime:function(dateTime1, dateTime2)
	{
			let compareDate = oFF.XDateTimeUtils.compareDate(dateTime1.getDate(), dateTime2.getDate());
		if (compareDate !== 0)
		{
			return compareDate;
		}
		return oFF.XDateTimeUtils.compareTime(dateTime1.getTime(), dateTime2.getTime());
	},
	compareInts:function(value, compareTo)
	{
			if (value > compareTo)
		{
			return 1;
		}
		if (value < compareTo)
		{
			return -1;
		}
		return 0;
	},
	compareTime:function(firstTime, secondTime)
	{
			let hourCompare = oFF.XDateTimeUtils.compareInts(firstTime.getHourOfDay(), secondTime.getHourOfDay());
		if (hourCompare !== 0)
		{
			return hourCompare;
		}
		let minuteCompare = oFF.XDateTimeUtils.compareInts(firstTime.getMinuteOfHour(), secondTime.getMinuteOfHour());
		if (minuteCompare !== 0)
		{
			return minuteCompare;
		}
		let secondCompare = oFF.XDateTimeUtils.compareInts(firstTime.getSecondOfMinute(), secondTime.getSecondOfMinute());
		if (secondCompare !== 0)
		{
			return secondCompare;
		}
		return oFF.XDateTimeUtils.compareInts(firstTime.getMillisecondOfSecond(), secondTime.getMillisecondOfSecond());
	}
};

oFF.XDefaultDateTimeProvider = function() {};
oFF.XDefaultDateTimeProvider.prototype = new oFF.XObject();
oFF.XDefaultDateTimeProvider.prototype._ff_c = "XDefaultDateTimeProvider";

oFF.XDefaultDateTimeProvider.create = function()
{
	return new oFF.XDefaultDateTimeProvider();
};
oFF.XDefaultDateTimeProvider.prototype.getCurrentDateTime = function()
{
	return oFF.XDateTime.createCurrentLocalDateTime();
};
oFF.XDefaultDateTimeProvider.prototype.getCurrentTimeInMilliseconds = function()
{
	return oFF.XSystemUtils.getCurrentTimeInMilliseconds();
};
oFF.XDefaultDateTimeProvider.prototype.getLocalTimezoneOffset = function()
{
	return oFF.XSystemUtils.getSystemTimezoneOffsetInMilliseconds();
};

oFF.XEra = function() {};
oFF.XEra.prototype = new oFF.XObject();
oFF.XEra.prototype._ff_c = "XEra";

oFF.XEra.create = function(name, abbr, since, localTime)
{
	let instance = new oFF.XEra();
	instance.m_name = name;
	instance.m_abbr = abbr;
	instance.m_since = since;
	instance.m_localTime = localTime;
	let gcal = oFF.XGregorianCalendar.create();
	let date = gcal.newCalendarDate(null);
	instance.m_sinceDate = gcal.getCalendarDate(since, date);
	return instance;
};
oFF.XEra.prototype.m_abbr = null;
oFF.XEra.prototype.m_localTime = false;
oFF.XEra.prototype.m_name = null;
oFF.XEra.prototype.m_since = 0;
oFF.XEra.prototype.m_sinceDate = null;
oFF.XEra.prototype.getAbbreviation = function()
{
	return this.m_abbr;
};
oFF.XEra.prototype.getName = function()
{
	return this.m_name;
};
oFF.XEra.prototype.getSince = function(timeZone)
{
	if (oFF.isNull(timeZone) || !this.m_localTime)
	{
		return this.m_since;
	}
	let offset = timeZone.getOffset(this.m_since);
	return this.m_since - offset;
};
oFF.XEra.prototype.getSinceDate = function()
{
	return this.m_sinceDate;
};
oFF.XEra.prototype.isLocalTime = function()
{
	return this.m_localTime;
};

oFF.XLocale = function() {};
oFF.XLocale.prototype = new oFF.XObject();
oFF.XLocale.prototype._ff_c = "XLocale";

oFF.XLocale.FRANCE_KEY = "FR";
oFF.XLocale.GERMANY_KEY = "DE";
oFF.XLocale.UK_KEY = "GB";
oFF.XLocale.US_KEY = "US";
oFF.XLocale.createConstant = function(lang, country)
{
	return null;
};
oFF.XLocale.getXLocale = function(localeKey)
{
	if (oFF.XString.isEqual(localeKey, oFF.XLocale.UK_KEY) || oFF.XString.isEqual(localeKey, oFF.XLocale.US_KEY))
	{
		return oFF.XLocale.createConstant("en", localeKey);
	}
	else if (oFF.XString.isEqual(localeKey, oFF.XLocale.FRANCE_KEY))
	{
		return oFF.XLocale.createConstant("fr", localeKey);
	}
	else if (oFF.XString.isEqual(localeKey, oFF.XLocale.GERMANY_KEY))
	{
		return oFF.XLocale.createConstant("de", localeKey);
	}
	return null;
};

oFF.XAmPmFormatToken = function() {};
oFF.XAmPmFormatToken.prototype = new oFF.XObject();
oFF.XAmPmFormatToken.prototype._ff_c = "XAmPmFormatToken";

oFF.XAmPmFormatToken.create = function(isCapitalized)
{
	let obj = new oFF.XAmPmFormatToken();
	obj.m_size = 2;
	obj.m_isCapitalized = isCapitalized;
	return obj;
};
oFF.XAmPmFormatToken.prototype.m_isCapitalized = false;
oFF.XAmPmFormatToken.prototype.m_size = 0;
oFF.XAmPmFormatToken.prototype.getDateTimeElementString = function(dateTime)
{
	if (dateTime.getHourOfDay() > 12)
	{
		return this.m_isCapitalized ? "PM" : "pm";
	}
	return this.m_isCapitalized ? "AM" : "am";
};
oFF.XAmPmFormatToken.prototype.getSize = function()
{
	return 0;
};
oFF.XAmPmFormatToken.prototype.setDateTimeElementValue = function(dateTime, dateTimeString, begin)
{
	let dateElementString = oFF.XString.substring(dateTimeString, begin, begin + this.m_size);
	dateElementString = oFF.XString.toLowerCase(dateElementString);
	if (oFF.XString.isEqual(dateElementString, "pm"))
	{
		let hourOfDay = dateTime.getHourOfDay();
		if (hourOfDay < 12 && hourOfDay > 0)
		{
			hourOfDay = hourOfDay + 12;
		}
		dateTime.setHourOfDay(hourOfDay);
	}
};

oFF.XMonthStringToken = function() {};
oFF.XMonthStringToken.prototype = new oFF.XObject();
oFF.XMonthStringToken.prototype._ff_c = "XMonthStringToken";

oFF.XMonthStringToken.create = function()
{
	let obj = new oFF.XMonthStringToken();
	obj.setup();
	return obj;
};
oFF.XMonthStringToken.prototype.m_monthStrings = null;
oFF.XMonthStringToken.prototype.getDateTimeElementString = function(dateTime)
{
	let monthOfYear = dateTime.getMonthOfYear();
	return this.m_monthStrings.get(monthOfYear - 1);
};
oFF.XMonthStringToken.prototype.getSize = function()
{
	return 3;
};
oFF.XMonthStringToken.prototype.setDateTimeElementValue = function(dateTime, dateTimeString, begin)
{
	let dateElementString = oFF.XString.substring(dateTimeString, begin, begin + 3);
	for (let i = 0; i < this.m_monthStrings.size(); i++)
	{
		if (oFF.XString.isEqual(dateElementString, this.m_monthStrings.get(i)))
		{
			dateTime.setMonthOfYear(i + 1);
			break;
		}
	}
};
oFF.XMonthStringToken.prototype.setup = function()
{
	this.m_monthStrings = oFF.XArray.create(12);
	this.m_monthStrings.set(0, "Jan");
	this.m_monthStrings.set(1, "Feb");
	this.m_monthStrings.set(2, "Mar");
	this.m_monthStrings.set(3, "Apr");
	this.m_monthStrings.set(4, "May");
	this.m_monthStrings.set(5, "Jun");
	this.m_monthStrings.set(6, "Jul");
	this.m_monthStrings.set(7, "Aug");
	this.m_monthStrings.set(8, "Sep");
	this.m_monthStrings.set(9, "Oct");
	this.m_monthStrings.set(10, "Nov");
	this.m_monthStrings.set(11, "Dec");
};

oFF.XNumericFormatToken = function() {};
oFF.XNumericFormatToken.prototype = new oFF.XObject();
oFF.XNumericFormatToken.prototype._ff_c = "XNumericFormatToken";

oFF.XNumericFormatToken.create = function(token, size)
{
	let numericFormatToken = new oFF.XNumericFormatToken();
	numericFormatToken.m_token = token;
	numericFormatToken.m_size = size;
	return numericFormatToken;
};
oFF.XNumericFormatToken.prototype.m_size = 0;
oFF.XNumericFormatToken.prototype.m_token = null;
oFF.XNumericFormatToken.prototype.getDateTimeElementString = function(dateTime)
{
	let value = "";
	if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.YEAR_TOKEN))
	{
		value = oFF.XStringUtils.addNumberPadded(dateTime.getYear(), this.m_size);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.MONTH_TOKEN))
	{
		value = oFF.XStringUtils.addNumberPadded(dateTime.getMonthOfYear(), this.m_size);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.DAY_OF_MONTH_TOKEN))
	{
		value = oFF.XStringUtils.addNumberPadded(dateTime.getDayOfMonth(), this.m_size);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.HOUR_TOKEN))
	{
		value = oFF.XStringUtils.addNumberPadded(dateTime.getHourOfDay(), this.m_size);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.HOUR_AM_PM_TOKEN))
	{
		let hourAMPM = 0;
		if (dateTime.getHourOfDay() > 12)
		{
			hourAMPM = oFF.XMath.mod(dateTime.getHourOfDay(), 12);
		}
		else
		{
			hourAMPM = dateTime.getHourOfDay();
		}
		value = oFF.XStringUtils.addNumberPadded(hourAMPM, this.m_size);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.MINUTE_TOKEN))
	{
		value = oFF.XStringUtils.addNumberPadded(dateTime.getMinuteOfHour(), this.m_size);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.SECOND_TOKEN))
	{
		value = oFF.XStringUtils.addNumberPadded(dateTime.getSecondOfMinute(), this.m_size);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.MILLISECOND_TOKEN))
	{
		value = oFF.XStringUtils.addNumberPadded(dateTime.getMillisecondOfSecond(), this.m_size);
	}
	return value;
};
oFF.XNumericFormatToken.prototype.getSize = function()
{
	return this.m_size;
};
oFF.XNumericFormatToken.prototype.setDateTimeElementValue = function(dateTime, dateTimeString, begin)
{
	let dateElementString = oFF.XString.substring(dateTimeString, begin, begin + this.m_size);
	let integerValue = oFF.XInteger.convertFromString(dateElementString);
	if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.YEAR_TOKEN))
	{
		dateTime.setYear(integerValue);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.MONTH_TOKEN))
	{
		dateTime.setMonthOfYear(integerValue);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.DAY_OF_MONTH_TOKEN))
	{
		dateTime.setDayOfMonth(integerValue);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.HOUR_TOKEN) || oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.HOUR_AM_PM_TOKEN))
	{
		dateTime.setHourOfDay(integerValue);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.MINUTE_TOKEN))
	{
		dateTime.setMinuteOfHour(integerValue);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.SECOND_TOKEN))
	{
		dateTime.setSecondOfMinute(integerValue);
	}
	else if (oFF.XString.isEqual(this.m_token, oFF.DateFormatterConstants.MILLISECOND_TOKEN))
	{
		dateTime.setMillisecondOfSecond(integerValue);
	}
};

oFF.XTimeZoneFormatToken = function() {};
oFF.XTimeZoneFormatToken.prototype = new oFF.XObject();
oFF.XTimeZoneFormatToken.prototype._ff_c = "XTimeZoneFormatToken";

oFF.XTimeZoneFormatToken.create = function(size)
{
	let timezoneFormatToken = new oFF.XTimeZoneFormatToken();
	timezoneFormatToken.m_size = size;
	return timezoneFormatToken;
};
oFF.XTimeZoneFormatToken.prototype.m_size = 0;
oFF.XTimeZoneFormatToken.prototype.getDateTimeElementString = function(dateTime)
{
	return dateTime.getTimezoneOffsetString();
};
oFF.XTimeZoneFormatToken.prototype.getSize = function()
{
	return this.m_size;
};
oFF.XTimeZoneFormatToken.prototype.getTimeZone = function(dateTimeString, begin)
{
	let timezoneOffsetString = oFF.XString.substring(dateTimeString, begin, begin + 5);
	let signString = oFF.XString.substring(dateTimeString, begin - 1, begin);
	let hourString = oFF.XString.substring(timezoneOffsetString, 0, 2);
	let minuteString = oFF.XString.substring(timezoneOffsetString, 3, 5);
	let hours = oFF.XInteger.convertFromString(hourString);
	let minutes = oFF.XInteger.convertFromString(minuteString);
	let milliseconds = hours * oFF.DateConstants.HOUR_IN_MILLIS + minutes * oFF.DateConstants.MINUTE_IN_MILLIS;
	if (oFF.XString.isEqual("-", signString))
	{
		milliseconds = milliseconds * -1;
	}
	return oFF.XSimpleTimeZone.createWithOffsetAndId(milliseconds, "");
};
oFF.XTimeZoneFormatToken.prototype.setDateTimeElementValue = function(dateTime, dateTimeString, begin)
{
	let newBegin = begin + 1;
	if (this.m_size === 3 && newBegin + 1 < oFF.XString.size(dateTimeString))
	{
		let timeZone = this.getTimeZone(dateTimeString, newBegin);
		dateTime.setTimeZone(timeZone);
	}
};

oFF.XCalendarDate = function() {};
oFF.XCalendarDate.prototype = new oFF.XObject();
oFF.XCalendarDate.prototype._ff_c = "XCalendarDate";

oFF.XCalendarDate.prototype.m_dayOfMonth = 0;
oFF.XCalendarDate.prototype.m_dayOfWeek = 0;
oFF.XCalendarDate.prototype.m_daylightSaving = 0;
oFF.XCalendarDate.prototype.m_era = null;
oFF.XCalendarDate.prototype.m_forceStandardTime = false;
oFF.XCalendarDate.prototype.m_fraction = 0;
oFF.XCalendarDate.prototype.m_hours = 0;
oFF.XCalendarDate.prototype.m_leapYear = false;
oFF.XCalendarDate.prototype.m_millis = 0;
oFF.XCalendarDate.prototype.m_minutes = 0;
oFF.XCalendarDate.prototype.m_month = 0;
oFF.XCalendarDate.prototype.m_normalized = false;
oFF.XCalendarDate.prototype.m_seconds = 0;
oFF.XCalendarDate.prototype.m_timeZone = null;
oFF.XCalendarDate.prototype.m_year = 0;
oFF.XCalendarDate.prototype.m_zoneOffset = 0;
oFF.XCalendarDate.prototype.addHours = function(numHours)
{
	if (numHours !== 0)
	{
		this.m_hours = this.m_hours + numHours;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.addMinutes = function(numMinutes)
{
	if (numMinutes !== 0)
	{
		this.m_minutes = this.m_minutes + numMinutes;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.addMonth = function(numMonth)
{
	if (numMonth !== 0)
	{
		this.m_month = this.m_month + numMonth;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.addSeconds = function(numSeconds)
{
	if (numSeconds !== 0)
	{
		this.m_seconds = this.m_seconds + numSeconds;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.addYear = function(numYears)
{
	if (numYears !== 0)
	{
		this.m_year = this.m_year + numYears;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.getDayOfMonth = function()
{
	return this.m_dayOfMonth;
};
oFF.XCalendarDate.prototype.getDayOfWeek = function()
{
	if (!this.isNormalized())
	{
		this.m_dayOfWeek = oFF.DateConstants.FIELD_UNDEFINED;
	}
	return this.m_dayOfWeek;
};
oFF.XCalendarDate.prototype.getDaylightSaving = function()
{
	return this.m_daylightSaving;
};
oFF.XCalendarDate.prototype.getEra = function()
{
	return this.m_era;
};
oFF.XCalendarDate.prototype.getHours = function()
{
	return this.m_hours;
};
oFF.XCalendarDate.prototype.getMillis = function()
{
	return this.m_millis;
};
oFF.XCalendarDate.prototype.getMinutes = function()
{
	return this.m_minutes;
};
oFF.XCalendarDate.prototype.getMonth = function()
{
	return this.m_month;
};
oFF.XCalendarDate.prototype.getSeconds = function()
{
	return this.m_seconds;
};
oFF.XCalendarDate.prototype.getTimeOfDay = function()
{
	if (!this.isNormalized())
	{
		this.m_fraction = oFF.DateConstants.TIME_UNDEFINED;
	}
	return this.m_fraction;
};
oFF.XCalendarDate.prototype.getYear = function()
{
	return this.m_year;
};
oFF.XCalendarDate.prototype.getZone = function()
{
	return this.m_timeZone;
};
oFF.XCalendarDate.prototype.getZoneOffset = function()
{
	return this.m_zoneOffset;
};
oFF.XCalendarDate.prototype.isDaylightTime = function()
{
	return this.m_daylightSaving !== 0;
};
oFF.XCalendarDate.prototype.isLeapYear = function()
{
	return this.m_leapYear;
};
oFF.XCalendarDate.prototype.isNormalized = function()
{
	return this.m_normalized;
};
oFF.XCalendarDate.prototype.isSameDate = function(date)
{
	return this.getDayOfWeek() === date.getDayOfWeek() && this.getMonth() === date.getMonth() && this.getYear() === date.getYear() && this.getEra() === date.getEra();
};
oFF.XCalendarDate.prototype.isStandardTime = function()
{
	return this.m_forceStandardTime;
};
oFF.XCalendarDate.prototype.setDate = function(year, month, dayOfMonth)
{
	this.setYear(year);
	this.setMonth(month);
	this.setDayOfMonth(dayOfMonth);
	return this;
};
oFF.XCalendarDate.prototype.setDayOfMonth = function(dayOfMonth)
{
	if (this.m_dayOfMonth !== dayOfMonth)
	{
		this.m_dayOfMonth = dayOfMonth;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.setDayOfWeek = function(dayOfWeek)
{
	this.m_dayOfWeek = dayOfWeek;
};
oFF.XCalendarDate.prototype.setDaylightSaving = function(daylightSaving)
{
	this.m_daylightSaving = daylightSaving;
};
oFF.XCalendarDate.prototype.setEra = function(era)
{
	if (oFF.notNull(this.m_era) && this.m_era.isEqualTo(era))
	{
		return this;
	}
	this.m_era = era;
	this.m_normalized = false;
	return this;
};
oFF.XCalendarDate.prototype.setHours = function(hours)
{
	if (this.m_hours !== hours)
	{
		this.m_hours = hours;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.setLeapYear = function(leapYear)
{
	this.m_leapYear = leapYear;
};
oFF.XCalendarDate.prototype.setMillis = function(millis)
{
	if (this.m_millis !== millis)
	{
		this.m_millis = millis;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.setMinutes = function(minutes)
{
	if (this.m_minutes !== minutes)
	{
		this.m_minutes = minutes;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.setMonth = function(month)
{
	if (this.m_month !== month)
	{
		this.m_month = month;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.setNormalized = function(normalized)
{
	this.m_normalized = normalized;
};
oFF.XCalendarDate.prototype.setSeconds = function(seconds)
{
	if (this.m_seconds !== seconds)
	{
		this.m_seconds = seconds;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.setStandardTime = function(standardTime)
{
	this.m_forceStandardTime = standardTime;
};
oFF.XCalendarDate.prototype.setTimeOfDay = function(hours, minutes, seconds, millis)
{
	this.setHours(hours);
	this.setMinutes(minutes);
	this.setSeconds(seconds);
	this.setMillis(millis);
	return this;
};
oFF.XCalendarDate.prototype.setTimeOfDayWithFraction = function(fraction)
{
	this.m_fraction = fraction;
};
oFF.XCalendarDate.prototype.setYear = function(year)
{
	if (this.m_year !== year)
	{
		this.m_year = year;
		this.m_normalized = false;
	}
	return this;
};
oFF.XCalendarDate.prototype.setZone = function(zoneInfo)
{
	this.m_timeZone = zoneInfo;
	return this;
};
oFF.XCalendarDate.prototype.setZoneOffset = function(offset)
{
	this.m_zoneOffset = offset;
};
oFF.XCalendarDate.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_dayOfWeek = oFF.DateConstants.FIELD_UNDEFINED;
};

oFF.XPropertyEvent = function() {};
oFF.XPropertyEvent.prototype = new oFF.XObject();
oFF.XPropertyEvent.prototype._ff_c = "XPropertyEvent";

oFF.XPropertyEvent.create = function(component, propertyName, stringValue)
{
	let theEvent = new oFF.XPropertyEvent();
	theEvent.m_propertyName = propertyName;
	theEvent.m_component = component;
	theEvent.m_stringValue = stringValue;
	return theEvent;
};
oFF.XPropertyEvent.prototype.m_component = null;
oFF.XPropertyEvent.prototype.m_propertyName = null;
oFF.XPropertyEvent.prototype.m_stringValue = null;
oFF.XPropertyEvent.prototype.getComponent = function()
{
	return this.m_component;
};
oFF.XPropertyEvent.prototype.getProperty = function()
{
	return this.m_propertyName;
};
oFF.XPropertyEvent.prototype.getString = function()
{
	return this.m_stringValue;
};
oFF.XPropertyEvent.prototype.releaseObject = function()
{
	this.m_component = null;
	this.m_propertyName = null;
	this.m_stringValue = null;
	oFF.XObject.prototype.releaseObject.call( this );
};

oFF.XPropertyListenerPair = function() {};
oFF.XPropertyListenerPair.prototype = new oFF.XObject();
oFF.XPropertyListenerPair.prototype._ff_c = "XPropertyListenerPair";

oFF.XPropertyListenerPair.create = function(listener, property, customIdentifier)
{
	let element = new oFF.XPropertyListenerPair();
	element.setupExt(listener, property, customIdentifier);
	return element;
};
oFF.XPropertyListenerPair.prototype.m_customIdentifier = null;
oFF.XPropertyListenerPair.prototype.m_listenerWeakReference = null;
oFF.XPropertyListenerPair.prototype.m_property = null;
oFF.XPropertyListenerPair.prototype.getCustomIdentifier = function()
{
	return this.m_customIdentifier;
};
oFF.XPropertyListenerPair.prototype.getListener = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_listenerWeakReference);
};
oFF.XPropertyListenerPair.prototype.getProperty = function()
{
	return this.m_property;
};
oFF.XPropertyListenerPair.prototype.hasWeakReference = function()
{
	return oFF.notNull(this.m_listenerWeakReference);
};
oFF.XPropertyListenerPair.prototype.releaseObject = function()
{
	this.m_customIdentifier = null;
	this.m_listenerWeakReference = oFF.XObjectExt.release(this.m_listenerWeakReference);
	this.m_property = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XPropertyListenerPair.prototype.setCustomIdentifier = function(customIdentifier)
{
	this.m_customIdentifier = customIdentifier;
};
oFF.XPropertyListenerPair.prototype.setProperty = function(property)
{
	this.m_property = property;
};
oFF.XPropertyListenerPair.prototype.setupExt = function(listener, property, customIdentifier)
{
	this.m_listenerWeakReference = oFF.XWeakReferenceUtil.getWeakRef(listener);
	this.m_customIdentifier = customIdentifier;
	this.m_property = property;
};
oFF.XPropertyListenerPair.prototype.toString = function()
{
	if (oFF.isNull(this.m_listenerWeakReference))
	{
		return "[Empty]";
	}
	return this.m_listenerWeakReference.toString();
};

oFF.XEnvironmentConstants = {

	DISPATCHER_ALIAS:"$alias$",
	DISPATCHER_HOST:"$host$",
	DISPATCHER_PATH:"$path$",
	DISPATCHER_PORT:"$port$",
	DISPATCHER_PREFIX:"$prefix$",
	DISPATCHER_PROTOCOL:"$protocol$",
	DISPATCHER_SYSTEM_NAME:"$system_name$",
	ENABLE_FIDDLER:"ff_fiddler",
	ENABLE_HTTP_FILE_TRACING:"ff_tracing_enable",
	ENABLE_VFS:"ff_vfs",
	FF_DISPATCHER_TEMPLATE:"ff_dispatcher_template",
	FIDDLER_HOST:"127.0.0.1",
	FIDDLER_PORT:"8888",
	FIREFLY_ADD_INA_CAPABILITY:"ff_ina_add_capa",
	FIREFLY_ADMIN_CFG_DIR:"ff_cfg_admin_dir",
	FIREFLY_CACHE:"ff_cache",
	FIREFLY_CACHE_ENCODER_TYPE:"ff_cache_encoder_type",
	FIREFLY_CACHE_SCHEMA:"ff_cache_schema",
	FIREFLY_CACHE_TYPE:"ff_cache_type",
	FIREFLY_DISABLE_AUTH_HEADER_WHEN_CONNECTED:"ff_disable_auth_header_when_connected",
	FIREFLY_DISABLE_CONNECTION_LOGOFF:"ff_disable_connection_logoff",
	FIREFLY_ENABLE_SAML_HTTP_CLIENT:"ff_enable_saml_http_client",
	FIREFLY_ENABLE_SAML_INVISIBLE_IFRAME_AUTH:"ff_enable_saml_invisible_iframe_auth",
	FIREFLY_ENABLE_SAML_VISIBLE_IFRAME_AUTH:"ff_enable_saml_visible_iframe_auth",
	FIREFLY_ENCRYPTION_TOKEN_URL:"ff_encryption_token_url",
	FIREFLY_ENV_PRIO:"ff_env_prio",
	FIREFLY_FEATURE_TOGGLES:"ff_feature_toggles",
	FIREFLY_FORMULA_EDITOR_ENABLE_ALL_FEATURE_TOGGLES:"ff_formula_editor_enable_all_feature_toggles",
	FIREFLY_FORMULA_EDITOR_ENHANCED_BASE_ENDPOINT:"ff_formula_editor_enhanced_base_endpoint",
	FIREFLY_FORMULA_EDITOR_ENHANCED_USE_MOCKED_SERVICE:"ff_formula_editor_enhanced_use_mock_service",
	FIREFLY_FORMULA_EDITOR_FEATURE_TOGGLES:"ff_formula_editor_feature_toggles",
	FIREFLY_FORMULA_EDITOR_MODEL_PREFIX_ENABLED_DEFAULT:"ff_formula_editor_model_prefix_enabled_default",
	FIREFLY_FORMULA_EDITOR_SHOW_ALL_FORMULA_ITEMS:"ff_formula_editor_show_all_formula_items",
	FIREFLY_FORMULA_EDITOR_USE_CONFIG_FRAMEWORK:"ff_formula_editor_use_config_framework",
	FIREFLY_FPA_ENABLE_SCHEDULING_FOR_OEM:"ff_fpa_enable_scheduling_for_oem",
	FIREFLY_FPA_SAML_IDP_METADATA_ENTITYID:"ff_fpa_saml_idp_metadata_entityid",
	FIREFLY_GDS_MODE:"ff_gds_mode",
	FIREFLY_INTERCEPT:"ff_intercept",
	FIREFLY_JUSTASK_BASE_PATH:"ff_justask_base_path",
	FIREFLY_JUSTASK_SYS:"ff_justask_sys",
	FIREFLY_KERNEL_HOMES:"ff_kernel_homes",
	FIREFLY_KERNEL_USER:"ff_kernel_user",
	FIREFLY_LOCKING:"ff_locking",
	FIREFLY_LOG_SEVERITY:"ff_log_severity",
	FIREFLY_LWV_KEEP_ALIVE:"ff_lwv_keep_alive",
	FIREFLY_MAIN_CLIB_SYS:"ff_main_clib_sys",
	FIREFLY_MASTER_SYSTEM_URI:"ff_master_sys_uri",
	FIREFLY_MIMES:"ff_mimes",
	FIREFLY_MOBILE_PROXY_PREFIX:"ff_mobile_proxy_prefix",
	FIREFLY_MODULE_LOADER_MODE:"ff_module_loader_mode",
	FIREFLY_MODULE_LOADER_VERBOSE:"ff_module_loader_verbose",
	FIREFLY_MODULE_PATH:"ff_module_path",
	FIREFLY_MOUNT:"ff_mount_",
	FIREFLY_PARALLEL_MODULE_LOAD:"ff_parallel_module_load",
	FIREFLY_PLATFORM_CFG_DIR:"ff_platform_cfg_dir",
	FIREFLY_PLATFORM_EXPORT_FILE:"ff_platform_export_file",
	FIREFLY_PLATFORM_VFS_MOUNT_FILE:"ff_platform_vfs_mount_file",
	FIREFLY_PRG_REPLACE:"ff_prg_replace",
	FIREFLY_PROFILES:"ff_profiles",
	FIREFLY_PROFILE_DEV:"dev",
	FIREFLY_PROGRAM_STORAGE_DIR:"ff_program_storage_dir",
	FIREFLY_PROTOCOL_FALLBACK:"ff_protocol_fallback",
	FIREFLY_QUERY_PRIVATE_CONN:"ff_query_private_conn",
	FIREFLY_RECENT_FILES:"ff_recent_files_path",
	FIREFLY_REMOVE_CREDENTIALS_AFTER_LOGIN:"ff_remove_credentials_after_login",
	FIREFLY_REMOVE_INA_CAPABILITY:"ff_ina_remove_capa",
	FIREFLY_RESOURCES:"ff_resources",
	FIREFLY_RESOURCE_EXPLORER_DATASPHERE_ENABLE_ALL_FEATURE_TOGGLES:"ff_resource_explorer_datasphere_enable_all_feature_toggles",
	FIREFLY_RPC_CACHING:"ff_rpc_caching",
	FIREFLY_RPC_CACHING_MAX_COUNT:"ff_rpc_caching_max_count",
	FIREFLY_RPC_CACHING_VALIDITY_TIME:"ff_rpc_caching_validity_time",
	FIREFLY_SDK:"ff_sdk",
	FIREFLY_SDK_ORIGIN:"ff_sdk_origin",
	FIREFLY_SECURE:"ff_secure",
	FIREFLY_SPHERE_DEBUGGING:"ff_sphereserver_debug",
	FIREFLY_SPHERE_TRACE:"ff_sphereserver_trace",
	FIREFLY_SYS_PROPERTY_PREFIX:"ff_sys_prop_",
	FIREFLY_TENANT_ID:"ff_tenant_id",
	FIREFLY_TMP:"ff_tmp",
	FIREFLY_TOKEN:"ff_token",
	FIREFLY_TRACE_NAME:"ff_webdispatcher_trace_name",
	FIREFLY_UI_ANCHOR_ID:"ff_ui_anchor_id",
	FIREFLY_UI_THEME:"ff_ui_theme",
	FIREFLY_USER:"ff_user",
	FIREFLY_USER_CFG_DIR:"ff_cfg_user_dir",
	FIREFLY_USER_PROFILE:"ff_user_profile",
	FIREFLY_USER_PROFILE_IFRAME:"ff_user_profile_iframe",
	FIREFLY_USER_PROFILE_RW:"ff_user_profile_rw",
	FIREFLY_USER_PROFILE_SERIALIZED:"ff_user_profile_serialized",
	FIREFLY_USER_ROLE:"ff_user_role",
	FIREFLY_VARIANT:"ff_variant",
	FIREFLY_WEBDISPATCHER_RECORDING_KEY_MODE:"ff_webdispatcher_recording_key_mode",
	HTTP_ALLOW_URI_SESSION:"http_allow_uri_session",
	HTTP_DISPATCHER_URI:"http_dispatcher_uri",
	HTTP_FILE_TRACING_FOLDER:"ff_tracing_folder",
	HTTP_PROXY_HOST:"http.proxy.host",
	HTTP_PROXY_PORT:"http.proxy.port",
	HTTP_USE_GZIP_ENCODING:"http_use_post_gzip",
	LANDSCAPE_CUSTOMIZATION:"ff_landscape_customization",
	LOCAL_ORCA_TENANT_ID:"ff_local_orca_tenant_id",
	NETWORK_CURRENT_DIR:"ff_network_current_dir",
	NETWORK_DIR:"ff_network_dir",
	NETWORK_HOST:"ff_network_host",
	NETWORK_LOCATION:"ff_network_location",
	NETWORK_LOCATION_PATH:"ff_network_location_path",
	NETWORK_PROTOCOL:"ff_network_protocol",
	NETWORK_ROOT_DIR:"ff_network_root_dir",
	OPEN_AI_ACCESS_FILTER:"ff_open_ai_access_filter",
	OPEN_AI_SERVICE_KEY:"ff_open_ai_service_key",
	REMOTE_FS_LOCATION:"ff_remote_fs_location",
	SYSTEM_LANDSCAPE_URI:"ff_system_landscape_uri",
	USE_MIRRORS:"ff_use_mirrors",
	XVERSION:"xversion"
};

oFF.XReferenceGrid = function() {};
oFF.XReferenceGrid.prototype = new oFF.XObject();
oFF.XReferenceGrid.prototype._ff_c = "XReferenceGrid";

oFF.XReferenceGrid.COLUMN = "|";
oFF.XReferenceGrid.CSV_SEPARATOR = ",";
oFF.XReferenceGrid.LINEFEED = "\r\n";
oFF.XReferenceGrid.ROW = "~";
oFF.XReferenceGrid.SEP_VERT = ":";
oFF.XReferenceGrid.SEP_VERT_BOTTOM = "~";
oFF.XReferenceGrid.SEP_VERT_TOP = "/";
oFF.XReferenceGrid.S_MAX_GRID_SIZE = 100000;
oFF.XReferenceGrid.create = function()
{
	let grid = new oFF.XReferenceGrid();
	grid.setup();
	return grid;
};
oFF.XReferenceGrid.prototype.m_cells = null;
oFF.XReferenceGrid.prototype.m_colDefs = null;
oFF.XReferenceGrid.prototype.m_createFingerprint = false;
oFF.XReferenceGrid.prototype.m_fingerprint = null;
oFF.XReferenceGrid.prototype.m_fixedHeight = 0;
oFF.XReferenceGrid.prototype.m_fixedWidth = 0;
oFF.XReferenceGrid.prototype.m_rowDefs = null;
oFF.XReferenceGrid.prototype.addColumnsDef = function(line)
{
	this.m_colDefs.add(line);
};
oFF.XReferenceGrid.prototype.addRowsDef = function(line)
{
	this.m_rowDefs.add(line);
};
oFF.XReferenceGrid.prototype.checkMaxGridSize = function()
{
	if (oFF.notNull(this.m_cells))
	{
		let colCount = this.m_cells.size0();
		let rowCount = this.m_cells.size1();
		let message = oFF.XStringBuffer.create();
		if (colCount > 0 && rowCount > 0)
		{
			let size = colCount * rowCount;
			if (size > oFF.XReferenceGrid.S_MAX_GRID_SIZE)
			{
				message.append("Grid size ").appendInt(size);
				message.append(" is above maximum grid size ").appendInt(oFF.XReferenceGrid.S_MAX_GRID_SIZE);
				throw oFF.XException.createRuntimeException(message.toString());
			}
		}
		else
		{
			if (colCount > oFF.XReferenceGrid.S_MAX_GRID_SIZE || rowCount > oFF.XReferenceGrid.S_MAX_GRID_SIZE)
			{
				if (colCount > oFF.XReferenceGrid.S_MAX_GRID_SIZE)
				{
					message.append("Column size ").appendInt(colCount);
				}
				else
				{
					message.append("Row size ").appendInt(rowCount);
				}
				message.append(" is above maximum grid size ").appendInt(oFF.XReferenceGrid.S_MAX_GRID_SIZE);
				throw oFF.XException.createRuntimeException(message.toString());
			}
		}
	}
};
oFF.XReferenceGrid.prototype.exportBodyColumns = function(maxCellSize, useColumnsHeaderPane, columnStart, maxColumnCount)
{
	return this.exportToAsciiExt(maxCellSize, false, useColumnsHeaderPane, 0, -1, columnStart, maxColumnCount);
};
oFF.XReferenceGrid.prototype.exportBodyRows = function(maxCellSize, useRowsHeaderPane, rowStart, maxRowCount)
{
	return this.exportToAsciiExt(maxCellSize, useRowsHeaderPane, false, rowStart, maxRowCount, 0, -1);
};
oFF.XReferenceGrid.prototype.exportToAscii = function(maxCellSize)
{
	return this.exportToAsciiExt(maxCellSize, true, true, 0, -1, 0, -1);
};
oFF.XReferenceGrid.prototype.exportToAsciiExt = function(maxCellSize, useRowsHeaderPane, useColumnsHeaderPane, rowStart, maxRowCount, columnStart, maxColumnCount)
{
	this.checkMaxGridSize();
	if (oFF.isNull(this.m_cells))
	{
		return "[empty]";
	}
	let buffer = oFF.XStringBuffer.create();
	let totalCols = this.m_cells.size0();
	let totalRows = this.m_cells.size1();
	let columns = oFF.XArrayOfInt.create(totalCols);
	let linesBySeparator = oFF.XHashMapByString.create();
	this.setMaxColumnSize(maxCellSize, columns, rowStart, maxRowCount);
	let rowCounter = 0;
	let idxRow = rowStart;
	while (idxRow < totalRows && (maxRowCount === -1 || rowCounter < maxRowCount))
	{
		if (rowCounter > 0)
		{
			buffer.append(oFF.XReferenceGrid.LINEFEED);
		}
		if (idxRow === this.m_fixedHeight && useColumnsHeaderPane)
		{
			buffer.append(this.renderLine(linesBySeparator, columns, oFF.XReferenceGrid.SEP_VERT_TOP, columnStart, maxColumnCount));
			buffer.append(oFF.XReferenceGrid.LINEFEED);
		}
		let colCounter = 0;
		let idxCol = columnStart;
		while (idxCol < totalCols && (maxColumnCount === -1 || colCounter < maxColumnCount))
		{
			if (colCounter > 0)
			{
				if (idxCol === this.m_fixedWidth)
				{
					buffer.append(oFF.XReferenceGrid.SEP_VERT);
				}
				else
				{
					buffer.append(oFF.XReferenceGrid.COLUMN);
				}
			}
			let cell = this.m_cells.getByIndices(idxCol, idxRow);
			let rest = columns.get(idxCol);
			if (oFF.isNull(cell))
			{
				buffer.append(oFF.XStringUtils.leftPad("", " ", rest));
			}
			else
			{
				let charCount = oFF.XMath.min(rest, cell.getCharacterCount());
				rest = rest - charCount;
				if (cell.isLeftAligned())
				{
					buffer.append(oFF.XStringUtils.rightPad(cell.getText(charCount), " ", rest));
				}
				else
				{
					buffer.append(oFF.XStringUtils.leftPad(cell.getText(charCount), " ", rest));
				}
			}
			colCounter++;
			idxCol++;
		}
		rowCounter++;
		idxRow++;
	}
	if (totalRows > 0 && useColumnsHeaderPane)
	{
		buffer.append(oFF.XReferenceGrid.LINEFEED);
		buffer.append(this.renderLine(linesBySeparator, columns, oFF.XReferenceGrid.SEP_VERT_BOTTOM, columnStart, maxColumnCount));
	}
	return buffer.toString();
};
oFF.XReferenceGrid.prototype.exportToCsv = function(maxRowCount, maxColumnCount)
{
	let buffer = oFF.XStringBuffer.create();
	for (let y = 0; y < this.m_cells.size1(); y++)
	{
		if (maxRowCount > -1 && y >= maxRowCount)
		{
			break;
		}
		for (let x = 0; x < this.m_cells.size0(); x++)
		{
			if (maxColumnCount > -1 && x >= maxColumnCount)
			{
				break;
			}
			let cell = this.m_cells.getByIndices(x, y);
			if (oFF.notNull(cell))
			{
				let text = cell.getText(-1);
				text = oFF.XString.replace(text, "\"", "\"\"");
				buffer.append("\"").append(text).append("\"");
			}
			else
			{
				buffer.append("\"\"");
			}
			if (x + 1 < this.m_cells.size0())
			{
				buffer.append(oFF.XReferenceGrid.CSV_SEPARATOR);
			}
		}
		if (y + 1 < this.m_cells.size1())
		{
			buffer.append(oFF.XReferenceGrid.LINEFEED);
		}
	}
	return buffer.toString();
};
oFF.XReferenceGrid.prototype.getColumnCount = function()
{
	return this.m_cells.size0();
};
oFF.XReferenceGrid.prototype.getColumnDef = function(index)
{
	return this.m_colDefs.get(index);
};
oFF.XReferenceGrid.prototype.getColumnMaxCharacters = function(column, rowStart, maxRowCount)
{
	let max = 0;
	let totalRows = this.m_cells.size1();
	let rowCounter = 0;
	for (let row = rowStart; row < totalRows && (maxRowCount === -1 || rowCounter < maxRowCount); row++)
	{
		let cell = this.m_cells.getByIndices(column, row);
		if (oFF.notNull(cell))
		{
			max = oFF.XMath.max(cell.getCharacterCount(), max);
		}
		rowCounter++;
	}
	return max;
};
oFF.XReferenceGrid.prototype.getFingerprint = function()
{
	return this.m_fingerprint;
};
oFF.XReferenceGrid.prototype.getFixedColumnsCount = function()
{
	return this.m_fixedWidth;
};
oFF.XReferenceGrid.prototype.getFixedHeight = function()
{
	return this.m_fixedHeight;
};
oFF.XReferenceGrid.prototype.getFixedRowsCount = function()
{
	return this.m_fixedHeight;
};
oFF.XReferenceGrid.prototype.getFixedWidth = function()
{
	return this.m_fixedWidth;
};
oFF.XReferenceGrid.prototype.getRowCount = function()
{
	return this.m_cells.size1();
};
oFF.XReferenceGrid.prototype.getRowsDef = function(index)
{
	return this.m_rowDefs.get(index);
};
oFF.XReferenceGrid.prototype.getSimpleCell = function(column, row)
{
	return this.m_cells.getByIndices(column, row);
};
oFF.XReferenceGrid.prototype.hasCells = function()
{
	return oFF.notNull(this.m_cells);
};
oFF.XReferenceGrid.prototype.releaseObject = function()
{
	if (oFF.notNull(this.m_cells))
	{
		let size0 = this.m_cells.size0();
		for (let x = 0; x < size0; x++)
		{
			let size1 = this.m_cells.size1();
			for (let y = 0; y < size1; y++)
			{
				let cell = this.m_cells.getByIndices(x, y);
				if (oFF.notNull(cell))
				{
					oFF.XObjectExt.release(cell);
					this.m_cells.setByIndices(x, y, null);
				}
			}
		}
		oFF.XObjectExt.release(this.m_cells);
		this.m_cells = null;
	}
	this.m_colDefs = null;
	this.m_rowDefs = null;
	this.m_fingerprint = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XReferenceGrid.prototype.renderLine = function(linesBySeparator, columns, verticalSeparator, columnStart, maxColumnCount)
{
	let line = linesBySeparator.getByKey(verticalSeparator);
	if (oFF.isNull(line))
	{
		let buffer = oFF.XStringBuffer.create();
		let totalColumns = columns.size();
		let colCount = 0;
		for (let idxCol = columnStart; idxCol < totalColumns && (maxColumnCount === -1 || colCount < maxColumnCount); idxCol++)
		{
			if (colCount > 0)
			{
				if (idxCol === this.m_fixedWidth)
				{
					buffer.append(verticalSeparator);
				}
				else
				{
					buffer.append(oFF.XReferenceGrid.ROW);
				}
			}
			let rest = columns.get(idxCol);
			for (let z = 0; z < rest; z++)
			{
				buffer.append(oFF.XReferenceGrid.ROW);
			}
			colCount++;
		}
		line = buffer.toString();
		linesBySeparator.put(verticalSeparator, line);
	}
	return line;
};
oFF.XReferenceGrid.prototype.setCell = function(x, y, cell, overwriteAllowed)
{
	if (this.m_createFingerprint)
	{
		let buffer = oFF.XStringBuffer.create();
		buffer.append(this.m_fingerprint);
		buffer.append("x:").appendInt(x);
		buffer.append("y:").appendInt(y);
		buffer.append(cell.getText(-1));
		this.m_fingerprint = oFF.XSha1.createSHA1(buffer.toString());
		oFF.XObjectExt.release(buffer);
	}
	else
	{
		if (!overwriteAllowed && this.m_cells.getByIndices(x, y) !== null)
		{
			throw oFF.XException.createIllegalStateException("Double entry");
		}
		if (this.m_rowDefs.get(y).hasTotals() || this.m_colDefs.get(x).hasTotals())
		{
			cell.setIsTotal(true);
		}
		this.m_cells.setByIndices(x, y, cell);
	}
};
oFF.XReferenceGrid.prototype.setFingerprintMode = function()
{
	this.m_createFingerprint = true;
	this.m_fingerprint = "--empty--";
};
oFF.XReferenceGrid.prototype.setFixedHeight = function(fixedHeight)
{
	this.m_fixedHeight = fixedHeight;
};
oFF.XReferenceGrid.prototype.setFixedWidth = function(fixedWidth)
{
	this.m_fixedWidth = fixedWidth;
};
oFF.XReferenceGrid.prototype.setFullSize = function(totalColumns, totalRows)
{
	this.m_cells = oFF.XArray2Dim.create(totalColumns, totalRows);
};
oFF.XReferenceGrid.prototype.setMaxColumnSize = function(maxCellSize, columns, rowStart, maxRowCount)
{
	let colCount = this.m_cells.size0();
	for (let idxCol = 0; idxCol < colCount; idxCol++)
	{
		let max = this.getColumnMaxCharacters(idxCol, rowStart, maxRowCount);
		if (maxCellSize !== -1 && max > maxCellSize)
		{
			max = maxCellSize;
		}
		columns.set(idxCol, max);
	}
};
oFF.XReferenceGrid.prototype.setup = function()
{
	this.m_rowDefs = oFF.XList.create();
	this.m_colDefs = oFF.XList.create();
};

oFF.XReferenceGridCell = function() {};
oFF.XReferenceGridCell.prototype = new oFF.XObject();
oFF.XReferenceGridCell.prototype._ff_c = "XReferenceGridCell";

oFF.XReferenceGridCell.create = function(content, cellType)
{
	let object = new oFF.XReferenceGridCell();
	object.setupExt(content, cellType);
	return object;
};
oFF.XReferenceGridCell.prototype.m_alertLevel = null;
oFF.XReferenceGridCell.prototype.m_cellType = null;
oFF.XReferenceGridCell.prototype.m_col = 0;
oFF.XReferenceGridCell.prototype.m_colIndex = 0;
oFF.XReferenceGridCell.prototype.m_content = null;
oFF.XReferenceGridCell.prototype.m_dataValueId = null;
oFF.XReferenceGridCell.prototype.m_dimName = null;
oFF.XReferenceGridCell.prototype.m_displayLevel = 0;
oFF.XReferenceGridCell.prototype.m_displayValue = null;
oFF.XReferenceGridCell.prototype.m_drillState = null;
oFF.XReferenceGridCell.prototype.m_icon = null;
oFF.XReferenceGridCell.prototype.m_isInputEnabled = false;
oFF.XReferenceGridCell.prototype.m_isLeftAligned = false;
oFF.XReferenceGridCell.prototype.m_isTotal = false;
oFF.XReferenceGridCell.prototype.m_memName = null;
oFF.XReferenceGridCell.prototype.m_memName2 = null;
oFF.XReferenceGridCell.prototype.m_part = null;
oFF.XReferenceGridCell.prototype.m_row = 0;
oFF.XReferenceGridCell.prototype.m_rowIndex = 0;
oFF.XReferenceGridCell.prototype.getAlertLevel = function()
{
	return this.m_alertLevel;
};
oFF.XReferenceGridCell.prototype.getCellType = function()
{
	return this.m_cellType;
};
oFF.XReferenceGridCell.prototype.getCharacterCount = function()
{
	if (oFF.isNull(this.m_content))
	{
		return 0;
	}
	return oFF.XString.size(this.m_content);
};
oFF.XReferenceGridCell.prototype.getColumn = function()
{
	return this.m_col;
};
oFF.XReferenceGridCell.prototype.getColumnTupleIndex = function()
{
	return this.m_colIndex;
};
oFF.XReferenceGridCell.prototype.getDataValueId = function()
{
	return this.m_dataValueId;
};
oFF.XReferenceGridCell.prototype.getDimension = function()
{
	return this.m_dimName;
};
oFF.XReferenceGridCell.prototype.getDisplayLevel = function()
{
	return this.m_displayLevel;
};
oFF.XReferenceGridCell.prototype.getDisplayValue = function()
{
	return this.m_displayValue;
};
oFF.XReferenceGridCell.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.XReferenceGridCell.prototype.getIcon = function()
{
	return this.m_icon;
};
oFF.XReferenceGridCell.prototype.getMember = function()
{
	return this.m_memName;
};
oFF.XReferenceGridCell.prototype.getMember2 = function()
{
	return this.m_memName2;
};
oFF.XReferenceGridCell.prototype.getPart = function()
{
	return this.m_part;
};
oFF.XReferenceGridCell.prototype.getRow = function()
{
	return this.m_row;
};
oFF.XReferenceGridCell.prototype.getRowTupleIndex = function()
{
	return this.m_rowIndex;
};
oFF.XReferenceGridCell.prototype.getText = function(max)
{
	if (oFF.isNull(this.m_content))
	{
		return "";
	}
	if (oFF.XString.size(this.m_content) > max)
	{
		return oFF.XString.substring(this.m_content, 0, max);
	}
	return this.m_content;
};
oFF.XReferenceGridCell.prototype.isInputEnabled = function()
{
	return this.m_isInputEnabled;
};
oFF.XReferenceGridCell.prototype.isLeftAligned = function()
{
	return this.m_isLeftAligned;
};
oFF.XReferenceGridCell.prototype.isTotals = function()
{
	return this.m_isTotal;
};
oFF.XReferenceGridCell.prototype.releaseObject = function()
{
	this.m_content = null;
	this.m_cellType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XReferenceGridCell.prototype.setAlertLeve = function(alertLevel)
{
	this.m_alertLevel = alertLevel;
};
oFF.XReferenceGridCell.prototype.setColumn = function(column)
{
	this.m_col = column;
};
oFF.XReferenceGridCell.prototype.setColumnTupleIndex = function(index)
{
	this.m_colIndex = index;
};
oFF.XReferenceGridCell.prototype.setDataValueId = function(dataValueId)
{
	this.m_dataValueId = dataValueId;
};
oFF.XReferenceGridCell.prototype.setDimension = function(value)
{
	this.m_dimName = value;
};
oFF.XReferenceGridCell.prototype.setDisplayLevel = function(displayLevel)
{
	this.m_displayLevel = displayLevel;
};
oFF.XReferenceGridCell.prototype.setDisplayValue = function(displayValue)
{
	this.m_displayValue = displayValue;
};
oFF.XReferenceGridCell.prototype.setDrillState = function(drillState)
{
	this.m_drillState = drillState;
};
oFF.XReferenceGridCell.prototype.setIcon = function(icon)
{
	this.m_icon = icon;
};
oFF.XReferenceGridCell.prototype.setIsInputEnabled = function(isInputEnabled)
{
	this.m_isInputEnabled = isInputEnabled;
};
oFF.XReferenceGridCell.prototype.setIsTotal = function(isTotal)
{
	this.m_isTotal = isTotal;
};
oFF.XReferenceGridCell.prototype.setMember = function(value)
{
	this.m_memName = value;
};
oFF.XReferenceGridCell.prototype.setMember2 = function(value)
{
	this.m_memName2 = value;
};
oFF.XReferenceGridCell.prototype.setPart = function(part)
{
	this.m_part = part;
};
oFF.XReferenceGridCell.prototype.setRow = function(row)
{
	this.m_row = row;
};
oFF.XReferenceGridCell.prototype.setRowTupleIndex = function(index)
{
	this.m_rowIndex = index;
};
oFF.XReferenceGridCell.prototype.setupExt = function(content, cellType)
{
	this.m_content = content;
	this.m_isLeftAligned = cellType !== oFF.RgCellType.DATA;
	this.m_cellType = cellType;
};
oFF.XReferenceGridCell.prototype.toString = function()
{
	if (oFF.isNull(this.m_content))
	{
		return "";
	}
	return this.m_content;
};

oFF.XReferenceGridLine = function() {};
oFF.XReferenceGridLine.prototype = new oFF.XObject();
oFF.XReferenceGridLine.prototype._ff_c = "XReferenceGridLine";

oFF.XReferenceGridLine.create = function()
{
	return new oFF.XReferenceGridLine();
};
oFF.XReferenceGridLine.prototype.m_hasTotals = false;
oFF.XReferenceGridLine.prototype.hasTotals = function()
{
	return this.m_hasTotals;
};
oFF.XReferenceGridLine.prototype.setHasTotals = function(hasTotals)
{
	this.m_hasTotals = hasTotals;
};
oFF.XReferenceGridLine.prototype.toString = function()
{
	return oFF.XStringBuffer.create().append("Totals:").appendBoolean(this.m_hasTotals).toString();
};

oFF.XCaseUtils = {

	_processText:function(textToProcess, tokenFunction, joinStr)
	{
			if (oFF.XStringUtils.isNullOrEmpty(textToProcess))
		{
			return textToProcess;
		}
		let textTokens = oFF.XCaseUtils._tokenizeText(textToProcess);
		let newTokens = oFF.XList.create();
		oFF.XCollectionUtils.forEach(textTokens, (tmpToken) => {
			let modifiedToken = tokenFunction(tmpToken, newTokens);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(modifiedToken))
			{
				newTokens.add(modifiedToken);
			}
		});
		return oFF.XCollectionUtils.join(newTokens, joinStr);
	},
	_tokenizeText:function(text)
	{
			let buffer = oFF.XStringBuffer.create();
		let textTokens = oFF.XList.create();
		let size = oFF.XString.size(text);
		let mode = 0;
		for (let i = 0; i < size; i++)
		{
			let charAt = oFF.XString.getCharAt(text, i);
			let newMode = 0;
			if (charAt >= 48 && charAt <= 57)
			{
				newMode = 1;
			}
			else if (charAt >= 65 && charAt <= 90)
			{
				newMode = 2;
			}
			else if (charAt >= 97 && charAt <= 122)
			{
				newMode = 3;
			}
			else if (charAt === 45)
			{
				newMode = 4;
			}
			else if (charAt === 95)
			{
				newMode = 5;
			}
			else if (charAt === 46)
			{
				newMode = 6;
			}
			else if (charAt === 32)
			{
				newMode = 7;
			}
			if (newMode !== mode && newMode !== 3 && i > 0 && buffer.length() > 0)
			{
				textTokens.add(buffer.toString());
				buffer.clear();
			}
			mode = newMode;
			if (newMode === 1 || newMode === 2 || newMode === 3)
			{
				buffer.appendChar(charAt);
			}
		}
		textTokens.add(buffer.toString());
		oFF.XObjectExt.release(buffer);
		return textTokens;
	},
	toCamelCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			if (newTokenList.size() !== 0)
			{
				modifiedToken = oFF.XStringUtils.capitalize(modifiedToken);
			}
			return modifiedToken;
		}, "");
		return convertedText;
	},
	toDotCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			return modifiedToken;
		}, ".");
		return convertedText;
	},
	toHyphenCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			return modifiedToken;
		}, "-");
		return convertedText;
	},
	toKebapCase:function(text)
	{
			return oFF.XCaseUtils.toHyphenCase(text);
	},
	toPascalCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			modifiedToken = oFF.XStringUtils.capitalize(modifiedToken);
			return modifiedToken;
		}, "");
		return convertedText;
	},
	toSentenceCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			if (newTokenList.size() === 0)
			{
				modifiedToken = oFF.XStringUtils.capitalize(modifiedToken);
			}
			return modifiedToken;
		}, " ");
		return convertedText;
	},
	toSnakeCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			return modifiedToken;
		}, "_");
		return convertedText;
	},
	toStartCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			modifiedToken = oFF.XStringUtils.capitalize(modifiedToken);
			return modifiedToken;
		}, " ");
		return convertedText;
	},
	toTitleCase:function(text)
	{
			let convertedText = oFF.XCaseUtils._processText(text, (tmpToken, newTokenList) => {
			let modifiedToken = oFF.XString.toLowerCase(tmpToken);
			if (!oFF.XString.isEqual(modifiedToken, "a") && !oFF.XString.isEqual(modifiedToken, "an") && !oFF.XString.isEqual(modifiedToken, "the") && !oFF.XString.isEqual(modifiedToken, "and"))
			{
				modifiedToken = oFF.XStringUtils.capitalize(modifiedToken);
			}
			return modifiedToken;
		}, " ");
		return convertedText;
	}
};

oFF.MessageUtil = {

	checkNoError:function(messages)
	{
			if (oFF.notNull(messages) && messages.hasErrors())
		{
			throw oFF.XException.createAssertException(messages.getSummary());
		}
	},
	condenseMessagesToSingleError:function(messages)
	{
			if (!messages.hasErrors())
		{
			return null;
		}
		let stringBuffer = oFF.XStringBuffer.create();
		let errors = messages.getErrors();
		for (let i = 0; i < errors.size(); i++)
		{
			stringBuffer.appendLine(errors.get(i).toString());
		}
		return oFF.XError.create(stringBuffer.toString());
	},
	getMessageStringFromList:function(messages, defaultMessage)
	{
			let buff = oFF.XStringBuffer.create();
		buff.append(defaultMessage);
		if (oFF.notNull(messages) && oFF.XCollectionUtils.hasElements(messages.getMessages()))
		{
			let messageList = messages.getMessages();
			for (let i = 0; i < messageList.size(); i++)
			{
				buff.appendNewLine();
				buff.append(messageList.get(i).getText());
			}
		}
		return buff.toString();
	}
};

oFF.XNumberFormatter = {

	STANDARD_EXCEL_FORMAT:"#,##0",
	asciiTable:" !\"#$%&'()*+,-./0123456789:;<=>?",
	char0:48,
	char9:57,
	charComma:44,
	charDot:46,
	negativePrefix:45,
	adjustExcelDecimalPlace:function(defaultExcelFormat, numberFormatterSettings)
	{
			let result;
		if (oFF.XStringUtils.isNullOrEmpty(defaultExcelFormat))
		{
			result = "#";
		}
		else
		{
			result = defaultExcelFormat;
		}
		let indexOfDecimal = oFF.XString.indexOf(defaultExcelFormat, ".");
		let numberOfZerosNeeded = oFF.XMath.min(numberFormatterSettings.getMaxDigitsRight(), numberFormatterSettings.getRightPad());
		if (indexOfDecimal < 0 && numberOfZerosNeeded > 0)
		{
			result = oFF.XStringUtils.concatenate2(result, ".");
			indexOfDecimal = oFF.XString.size(result) - 1;
		}
		if (indexOfDecimal >= 0)
		{
			let lastIndex = numberOfZerosNeeded > 0 ? indexOfDecimal + 1 : indexOfDecimal;
			result = oFF.XStringUtils.rightPad(oFF.XString.substring(result, 0, lastIndex), "0", numberOfZerosNeeded);
		}
		return result;
	},
	buildExcelFormatString:function(prefix1, prefix2, prefix3, excelFormatString, suffix1, suffix2, suffix3, numberFormatterSettings, isPercentage)
	{
			let newPrefix = "";
		let newSuffix = "";
		let result = "";
		let prefixNoSign = oFF.XString.replace(prefix1, "+", "");
		prefixNoSign = oFF.XString.replace(prefixNoSign, "-", "");
		let suffixNoSign = oFF.XString.replace(suffix3, "+", "");
		suffixNoSign = oFF.XString.replace(suffixNoSign, "-", "");
		if (numberFormatterSettings.getSignPresentation() === oFF.SignPresentation.BRACKETS)
		{
			newPrefix = oFF.XNumberFormatter.wrapXlsString(oFF.XString.replace(prefixNoSign, "(", ""), prefix2, prefix3);
			newSuffix = oFF.XNumberFormatter.wrapXlsString(suffix1, suffix2, oFF.XString.replace(suffixNoSign, ")", ""));
			if (isPercentage)
			{
				newSuffix = oFF.XStringUtils.concatenate2(newSuffix, " %");
			}
			let positive = oFF.XStringUtils.concatenate3(newPrefix, excelFormatString, newSuffix);
			let negative = oFF.XStringUtils.concatenate5(newPrefix, "(", excelFormatString, ")", newSuffix);
			result = oFF.XStringUtils.concatenate3(positive, ";", negative);
		}
		else
		{
			newPrefix = oFF.XNumberFormatter.wrapXlsString(prefixNoSign, prefix2, prefix3);
			newSuffix = oFF.XNumberFormatter.wrapXlsString(suffix1, suffix2, "");
			let tailSuffix = oFF.XNumberFormatter.wrapXlsString(suffixNoSign, "", "");
			if (isPercentage)
			{
				tailSuffix = oFF.XStringUtils.concatenate2(tailSuffix, " %");
			}
			let resultWithoutTail = oFF.XStringUtils.concatenate3(newPrefix, excelFormatString, newSuffix);
			if (numberFormatterSettings.getSignPresentation() === oFF.SignPresentation.BEFORE_NUMBER)
			{
				let positive1 = oFF.XStringUtils.concatenate3("+", resultWithoutTail, tailSuffix);
				let negative1 = oFF.XStringUtils.concatenate3("-", resultWithoutTail, tailSuffix);
				result = oFF.XStringUtils.concatenate3(positive1, ";", negative1);
			}
			else if (numberFormatterSettings.getSignPresentation() === oFF.SignPresentation.AFTER_NUMBER)
			{
				let positive2 = oFF.XStringUtils.concatenate3(resultWithoutTail, "+", tailSuffix);
				let negative2 = oFF.XStringUtils.concatenate3(resultWithoutTail, "-", tailSuffix);
				result = oFF.XStringUtils.concatenate3(positive2, ";", negative2);
			}
			else
			{
				result = oFF.XStringUtils.concatenate2(resultWithoutTail, tailSuffix);
			}
		}
		return result;
	},
	charToInt:function(value)
	{
			return value - 48;
	},
	concatSpace:function(s, spaceIsPrefixed)
	{
			return spaceIsPrefixed ? oFF.XStringUtils.concatenate2(" ", s) : oFF.XStringUtils.concatenate2(s, " ");
	},
	convertAsciiToString:function(value)
	{
			return oFF.XString.substring(oFF.XNumberFormatter.asciiTable, value - 32, value - 31);
	},
	formatDecFloatToStringUsingSettingsWithCurrency:function(value, numberFormatterSettings, currencyText, scaleTexts, defaultExcelFormat, suppressScaleText, isPercentage)
	{
			return oFF.XNumberFormatter.formatStringifiedNumberToStringUsingSettingsWithCurrency(value.getStringRepresentation(), numberFormatterSettings, currencyText, scaleTexts, defaultExcelFormat, suppressScaleText, isPercentage);
	},
	formatDoubleToString:function(value, format)
	{
			return oFF.XNumberFormatter.formatStringifiedNumberToString(oFF.XDouble.convertToString(value), format);
	},
	formatDoubleToStringUsingSettings:function(value, numberFormatterSettings)
	{
			return oFF.XNumberFormatter.formatStringifiedNumberToStringUsingSettings(oFF.XDouble.convertToString(value), numberFormatterSettings);
	},
	formatDoubleToStringUsingSettingsWithCurrency:function(value, numberFormatterSettings, currencyText, scaleTexts, defaultExcelFormat, suppressScaleText, isPercentage)
	{
			return oFF.XNumberFormatter.formatStringifiedNumberToStringUsingSettingsWithCurrency(oFF.XDouble.convertToString(value), numberFormatterSettings, currencyText, scaleTexts, defaultExcelFormat, suppressScaleText, isPercentage);
	},
	formatHeaderStringUsingSettingsWithCurrency:function(numberFormatterSettings, currency, scaleFactor, scaleTexts)
	{
			if (oFF.isNull(currency))
		{
			throw oFF.XException.createIllegalArgumentException("The currency must not be null");
		}
		let formattedValue = "";
		let suffix = currency.getSecondString();
		let currencyFormatSettings = oFF.XCurrencyFormatSettings.createDefault();
		currencyFormatSettings.merge(numberFormatterSettings.getCurrencyFormatSettings());
		let valuePosition = currencyFormatSettings.getValuePosition();
		let scaleTextPosition = currencyFormatSettings.getScaleTextPosition();
		let currencyPresentationPosition = currencyFormatSettings.getCurrencyPresentationPosition();
		let currencyPresentationHasSpace = currencyFormatSettings.currencyPresentationHasSpace();
		let scaleTextHasSpace = currencyFormatSettings.scaleTextHasSpace();
		let currencyPresentation = currency.getFirstString();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(currencyPresentation) && currencyPresentationHasSpace)
		{
			let spaceIsPrefixed = currencyPresentationPosition > valuePosition;
			currencyPresentation = oFF.XNumberFormatter.concatSpace(currencyPresentation, spaceIsPrefixed);
		}
		let scaleFormatTuple = oFF.XNumberFormatter.getScaleText(scaleFactor, numberFormatterSettings.getScaleFormat(), scaleTexts);
		let scaleText = scaleFormatTuple.getName();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(scaleText) && scaleTextHasSpace)
		{
			let spaceIsPrefixed2 = scaleTextPosition > valuePosition;
			scaleText = oFF.XNumberFormatter.concatSpace(scaleText, spaceIsPrefixed2);
		}
		if (scaleTextPosition < currencyPresentationPosition)
		{
			formattedValue = oFF.XStringUtils.concatenate3(scaleText, currencyPresentation, suffix);
		}
		else
		{
			formattedValue = oFF.XStringUtils.concatenate3(currencyPresentation, scaleText, suffix);
		}
		return oFF.XString.trim(oFF.XString.replace(formattedValue, "  ", " "));
	},
	formatStringifiedNumber:function(stringifiedValue, numberFormatterSettings)
	{
			let valueString = oFF.XNumberFormatter.normalizeScientificFormat(stringifiedValue, oFF.XNumberFormatter.charDot);
		if (numberFormatterSettings.getScaleFactor() !== null)
		{
			let scaleProcessingStr = valueString;
			let addBackNegative = false;
			if (oFF.notNull(valueString) && oFF.XString.startsWith(valueString, "-"))
			{
				addBackNegative = true;
				scaleProcessingStr = oFF.XString.substring(valueString, 1, -1);
			}
			let scaleFactor = numberFormatterSettings.getScaleFactor().getInteger();
			if (scaleFactor < 0)
			{
				valueString = oFF.XNumberFormatter.moveDecimalRight(scaleProcessingStr, -numberFormatterSettings.getScaleFactor().getInteger());
			}
			else if (scaleFactor > 0)
			{
				valueString = oFF.XNumberFormatter.moveDecimalLeft(scaleProcessingStr, numberFormatterSettings.getScaleFactor().getInteger());
			}
			if (addBackNegative)
			{
				valueString = oFF.XStringUtils.concatenate2("-", valueString);
			}
		}
		let leftExpressionSb = oFF.XStringBuffer.create();
		let rightExpression = "";
		let isRight = false;
		let prefixSign = numberFormatterSettings.getPrefix();
		for (let y = 0; y < oFF.XString.size(valueString); y++)
		{
			let currentChar1 = oFF.XString.getCharAt(valueString, y);
			if (currentChar1 === prefixSign)
			{
				continue;
			}
			if (currentChar1 === oFF.XNumberFormatter.negativePrefix)
			{
				prefixSign = currentChar1;
				continue;
			}
			if (currentChar1 === oFF.XNumberFormatter.charDot)
			{
				isRight = true;
			}
			else
			{
				let currentCharString = oFF.XNumberFormatter.convertAsciiToString(currentChar1);
				if (isRight)
				{
					rightExpression = oFF.XStringUtils.concatenate2(rightExpression, currentCharString);
				}
				else
				{
					leftExpressionSb.append(currentCharString);
				}
			}
		}
		let leftExpressionLength = leftExpressionSb.length();
		let rightExpressionLength = oFF.XString.size(rightExpression);
		let roundingRequired = false;
		let maxDigitsRight = numberFormatterSettings.getMaxDigitsRight();
		if (maxDigitsRight !== 0)
		{
			if (maxDigitsRight > 0 && rightExpressionLength > maxDigitsRight)
			{
				let lastDigit = oFF.XNumberFormatter.charToInt(oFF.XString.getCharAt(rightExpression, maxDigitsRight - 1));
				let roundingBase = oFF.XNumberFormatter.charToInt(oFF.XString.getCharAt(rightExpression, maxDigitsRight));
				rightExpression = oFF.XString.substring(rightExpression, 0, maxDigitsRight - 1);
				rightExpression = oFF.XStringUtils.concatenate2(rightExpression, oFF.XInteger.convertToString(lastDigit));
				roundingRequired = roundingBase >= 5;
			}
			if (rightExpressionLength < maxDigitsRight && numberFormatterSettings.getRightPad() > rightExpressionLength)
			{
				rightExpression = oFF.XStringUtils.rightPad(rightExpression, "0", numberFormatterSettings.getRightPad() - rightExpressionLength);
			}
		}
		else if (oFF.XStringUtils.isNotNullAndNotEmpty(rightExpression))
		{
			let firstRightDigit = oFF.XNumberFormatter.charToInt(oFF.XString.getCharAt(rightExpression, 0));
			roundingRequired = firstRightDigit >= 5;
			rightExpression = "";
		}
		rightExpressionLength = oFF.XString.size(rightExpression);
		let leftExpression = leftExpressionSb.toString();
		oFF.XObjectExt.release(leftExpressionSb);
		if (numberFormatterSettings.getLeftPad() > 0)
		{
			leftExpression = oFF.XStringUtils.leftPad(leftExpression, "0", numberFormatterSettings.getLeftPad() - leftExpressionLength);
		}
		leftExpressionLength = oFF.XString.size(leftExpression);
		let result = oFF.XStringBuffer.create();
		let prefix = null;
		let suffix = null;
		if (numberFormatterSettings.getSignPresentation() === null)
		{
			if (prefixSign > 0)
			{
				prefix = oFF.XNumberFormatter.convertAsciiToString(prefixSign);
			}
		}
		else if (numberFormatterSettings.getSignPresentation() === oFF.SignPresentation.AFTER_NUMBER)
		{
			if (prefixSign === oFF.XNumberFormatter.negativePrefix)
			{
				suffix = "-";
			}
			else
			{
				suffix = "+";
			}
		}
		else if (numberFormatterSettings.getSignPresentation() === oFF.SignPresentation.BEFORE_NUMBER)
		{
			if (prefixSign === oFF.XNumberFormatter.negativePrefix)
			{
				prefix = "-";
			}
			else
			{
				prefix = "+";
			}
		}
		else if (numberFormatterSettings.getSignPresentation() === oFF.SignPresentation.BRACKETS)
		{
			if (prefixSign === oFF.XNumberFormatter.negativePrefix)
			{
				prefix = "(";
				suffix = ")";
			}
		}
		let mod = oFF.XMath.mod(leftExpressionLength, 3);
		for (let b = 0; b < leftExpressionLength; b++)
		{
			let currentChar2 = oFF.XString.getCharAt(leftExpression, b);
			if (numberFormatterSettings.getDecimalGroupingSeparator() !== null)
			{
				if (b > 0 && oFF.XMath.mod(b, 3) === mod)
				{
					result.append(numberFormatterSettings.getDecimalGroupingSeparator());
				}
			}
			result.append(oFF.XNumberFormatter.convertAsciiToString(currentChar2));
		}
		if (rightExpressionLength > 0)
		{
			let decimalSeparator = oFF.XStringUtils.isNotNullAndNotEmpty(numberFormatterSettings.getDecimalSeparator()) ? numberFormatterSettings.getDecimalSeparator() : ".";
			result.append(decimalSeparator);
		}
		result.append(rightExpression);
		if (roundingRequired)
		{
			result = oFF.XNumberFormatter.round(result.toString());
		}
		if (oFF.notNull(suffix))
		{
			result.append(suffix);
		}
		let resultString = result.toString();
		if (oFF.notNull(prefix))
		{
			resultString = oFF.XStringUtils.concatenate2(prefix, resultString);
		}
		return resultString;
	},
	formatStringifiedNumberToString:function(value, format)
	{
			let settings = oFF.XNumberFormatterSettingsFactory.getInstance().createFromString(format);
		return oFF.XNumberFormatter.formatStringifiedNumber(value, settings);
	},
	formatStringifiedNumberToStringUsingSettings:function(stringifiedValue, numberFormatterSettings)
	{
			let settings = oFF.XNumberFormatterSettings.create();
		settings.setDecimalSeparator(numberFormatterSettings.getDecimalSeparator());
		settings.setDecimalGroupingSeparator(numberFormatterSettings.getDecimalGroupingSeparator());
		settings.setScaleFactor(numberFormatterSettings.getScaleFactor());
		settings.setScaleFormat(numberFormatterSettings.getScaleFormat());
		settings.setSignPresentation(numberFormatterSettings.getSignPresentation());
		settings.setMaxDigitsRight(numberFormatterSettings.getMaxDigitsRight());
		settings.setRightPad(numberFormatterSettings.getRightPad());
		return oFF.XNumberFormatter.formatStringifiedNumber(stringifiedValue, settings);
	},
	formatStringifiedNumberToStringUsingSettingsWithCurrency:function(value, numberFormatterSettings, currencyText, scaleTexts, defaultExcelFormat, suppressScaleText, isPercentage)
	{
			if (oFF.isNull(currencyText))
		{
			throw oFF.XException.createIllegalArgumentException("The currency must not be null");
		}
		let formattedValue = oFF.XNumberFormatter.formatStringifiedNumberToStringUsingSettings(value, numberFormatterSettings);
		let excelFormat = oFF.XNumberFormatter.adjustExcelDecimalPlace(defaultExcelFormat, numberFormatterSettings);
		let currencyFormatSettings = oFF.XCurrencyFormatSettings.createDefault();
		currencyFormatSettings.merge(numberFormatterSettings.getCurrencyFormatSettings());
		let currencyPresentation = currencyText.getFirstString();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(currencyPresentation) && currencyFormatSettings.currencyPresentationHasSpace())
		{
			let spaceIsPrefixed = currencyFormatSettings.getCurrencyPresentationPosition() > currencyFormatSettings.getValuePosition();
			currencyPresentation = oFF.XNumberFormatter.concatSpace(currencyPresentation, spaceIsPrefixed);
		}
		let scaleFormatTuple = oFF.XNumberFormatter.getScaleText(numberFormatterSettings.getScaleFactor(), numberFormatterSettings.getScaleFormat(), scaleTexts);
		let scaleText = suppressScaleText ? "" : scaleFormatTuple.getName();
		let excelScale = scaleFormatTuple.getValue();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(scaleText) && currencyFormatSettings.scaleTextHasSpace())
		{
			let spaceIsPrefixed2 = currencyFormatSettings.getScaleTextPosition() > currencyFormatSettings.getValuePosition();
			scaleText = oFF.XNumberFormatter.concatSpace(scaleText, spaceIsPrefixed2);
		}
		let excelScaleText = "";
		if (oFF.XStringUtils.isNotNullAndNotEmpty(excelScale))
		{
			excelFormat = oFF.XStringUtils.concatenate2(excelFormat, excelScale);
			excelScaleText = scaleText;
		}
		let prefix = null;
		let suffix = null;
		if (oFF.XString.startsWith(formattedValue, "+"))
		{
			prefix = "+";
		}
		else if (oFF.XString.startsWith(formattedValue, "-"))
		{
			prefix = "-";
		}
		else if (oFF.XString.endsWith(formattedValue, "+"))
		{
			suffix = "+";
		}
		else if (oFF.XString.endsWith(formattedValue, "-"))
		{
			suffix = "-";
		}
		if (oFF.notNull(prefix))
		{
			formattedValue = oFF.XString.substring(formattedValue, 1, -1);
		}
		else if (oFF.notNull(suffix))
		{
			formattedValue = oFF.XString.substring(formattedValue, 0, oFF.XString.size(formattedValue) - 1);
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(suffix))
		{
			suffix = oFF.XStringUtils.concatenate2(suffix, currencyText.getSecondString());
		}
		else
		{
			suffix = currencyText.getSecondString();
		}
		let positions = currencyFormatSettings.getValuePosition() * 100 + currencyFormatSettings.getScaleTextPosition() * 10 + currencyFormatSettings.getCurrencyPresentationPosition();
		switch (positions)
		{
			case 12:
				formattedValue = oFF.XStringUtils.concatenate5(prefix, formattedValue, scaleText, currencyPresentation, suffix);
				excelFormat = oFF.XNumberFormatter.buildExcelFormatString(prefix, "", "", excelFormat, excelScaleText, currencyPresentation, suffix, numberFormatterSettings, isPercentage);
				break;

			case 21:
				formattedValue = oFF.XStringUtils.concatenate5(prefix, formattedValue, currencyPresentation, scaleText, suffix);
				excelFormat = oFF.XNumberFormatter.buildExcelFormatString(prefix, "", "", excelFormat, currencyPresentation, excelScaleText, suffix, numberFormatterSettings, isPercentage);
				break;

			case 102:
				formattedValue = oFF.XStringUtils.concatenate5(prefix, scaleText, formattedValue, currencyPresentation, suffix);
				excelFormat = oFF.XNumberFormatter.buildExcelFormatString(prefix, "", excelScaleText, excelFormat, currencyPresentation, "", suffix, numberFormatterSettings, isPercentage);
				break;

			case 120:
				formattedValue = oFF.XStringUtils.concatenate5(prefix, currencyPresentation, formattedValue, scaleText, suffix);
				excelFormat = oFF.XNumberFormatter.buildExcelFormatString(prefix, currencyPresentation, "", excelFormat, excelScaleText, "", suffix, numberFormatterSettings, isPercentage);
				break;

			case 201:
				formattedValue = oFF.XStringUtils.concatenate5(prefix, scaleText, currencyPresentation, formattedValue, suffix);
				excelFormat = oFF.XNumberFormatter.buildExcelFormatString(prefix, excelScaleText, currencyPresentation, excelFormat, "", "", suffix, numberFormatterSettings, isPercentage);
				break;

			case 210:
				formattedValue = oFF.XStringUtils.concatenate5(prefix, currencyPresentation, scaleText, formattedValue, suffix);
				excelFormat = oFF.XNumberFormatter.buildExcelFormatString(prefix, currencyPresentation, excelScaleText, excelFormat, "", "", suffix, numberFormatterSettings, isPercentage);
				break;

			default:
				throw oFF.XException.createIllegalArgumentException("Illegal positions for currency");
		}
		return oFF.XPairOfString.create(formattedValue, excelFormat);
	},
	getDefaultScaleFormatTuple:function(scalingFactor)
	{
			let scaleString;
		let excelScaleFormat;
		switch (scalingFactor)
		{
			case 0:
				scaleString = "";
				excelScaleFormat = "";
				break;

			case 1:
				scaleString = "(10x)";
				excelScaleFormat = "";
				break;

			case 2:
				scaleString = "(100x)";
				excelScaleFormat = "";
				break;

			case 3:
				scaleString = "k";
				excelScaleFormat = ",";
				break;

			case 4:
				scaleString = "(10k)";
				excelScaleFormat = "";
				break;

			case 5:
				scaleString = "(100k)";
				excelScaleFormat = "";
				break;

			case 6:
				scaleString = "m";
				excelScaleFormat = ",,";
				break;

			case 7:
				scaleString = "(10m)";
				excelScaleFormat = "";
				break;

			case 8:
				scaleString = "(100m)";
				excelScaleFormat = "";
				break;

			case 9:
				scaleString = "b";
				excelScaleFormat = ",,,";
				break;

			default:
				let billionsString = oFF.XStringUtils.rightPad("1", "0", scalingFactor - 9);
				scaleString = oFF.XStringUtils.concatenate3("(", billionsString, "b)");
				excelScaleFormat = "";
				break;
		}
		return oFF.XPairOfString.create(scaleString, excelScaleFormat);
	},
	getScaleText:function(scaling, scaleFormat, scaleTexts)
	{
			let scaleText = "";
		let excelScaleFormat = "";
		if (oFF.notNull(scaling))
		{
			let scalingFactor = scaling.getInteger();
			if (scalingFactor < 0)
			{
				let numZeros = (scalingFactor + 1) * -1;
				scaleText = oFF.XStringUtils.concatenate3("(0.", oFF.XStringUtils.leftPad("1", "0", numZeros), ")");
			}
			else
			{
				let scaleFormatTuple = oFF.XNumberFormatter.getDefaultScaleFormatTuple(scalingFactor);
				let defaultScaleText = scaleFormatTuple.getFirstString();
				excelScaleFormat = scaleFormatTuple.getSecondString();
				let scaleFormatName = oFF.isNull(scaleFormat) ? oFF.ScaleFormat.SHORT.getName() : scaleFormat.getName();
				let key = oFF.XStringUtils.concatenate3(scaleFormatName, "_", oFF.XInteger.convertToString(scalingFactor));
				if (oFF.notNull(scaleTexts))
				{
					scaleText = scaleTexts.getByKey(key);
				}
				if (oFF.XStringUtils.isNullOrEmpty(scaleText))
				{
					scaleText = defaultScaleText;
				}
			}
		}
		return oFF.XNameValuePair.create(scaleText, excelScaleFormat);
	},
	moveDecimalLeft:function(number, leftShiftCount)
	{
			if (leftShiftCount <= 0)
		{
			return number;
		}
		let valueString = number;
		let length = oFF.XString.size(valueString);
		let decimalPosition = oFF.XString.indexOf(valueString, ".");
		if (decimalPosition < 0)
		{
			decimalPosition = length;
		}
		let splitAroundDecimal = oFF.XNumberFormatter.splitAround(valueString, ".");
		let newBeforeDecimal;
		let newAfterDecimal;
		if (leftShiftCount >= decimalPosition)
		{
			let withoutDecimal = oFF.XStringUtils.concatenate2(splitAroundDecimal.getFirstString(), splitAroundDecimal.getSecondString());
			newBeforeDecimal = "0";
			newAfterDecimal = oFF.XStringUtils.leftPad(withoutDecimal, "0", leftShiftCount - decimalPosition);
		}
		else
		{
			let newDecimalPosition = decimalPosition - leftShiftCount;
			newBeforeDecimal = oFF.XString.substring(valueString, 0, newDecimalPosition);
			newAfterDecimal = oFF.XStringUtils.concatenate2(oFF.XString.substring(valueString, newDecimalPosition, decimalPosition), splitAroundDecimal.getSecondString());
		}
		valueString = oFF.XStringUtils.concatenate3(newBeforeDecimal, ".", newAfterDecimal);
		return oFF.XNumberFormatter.stripTailingZeros(valueString);
	},
	moveDecimalRight:function(number, rightShiftCount)
	{
			if (rightShiftCount <= 0)
		{
			return number;
		}
		let valueString = number;
		let length = oFF.XString.size(valueString);
		let decimalPosition = oFF.XString.indexOf(valueString, ".");
		if (decimalPosition < 0)
		{
			decimalPosition = length;
		}
		let splitAroundDecimal = oFF.XNumberFormatter.splitAround(valueString, ".");
		let beforeDecimal = splitAroundDecimal.getFirstString();
		let afterDecimal = splitAroundDecimal.getSecondString() === null ? "" : splitAroundDecimal.getSecondString();
		if (rightShiftCount >= oFF.XString.size(afterDecimal))
		{
			valueString = oFF.XStringUtils.concatenate3(beforeDecimal, afterDecimal, oFF.XStringUtils.rightPad("", "0", rightShiftCount - oFF.XString.size(afterDecimal)));
		}
		else
		{
			let first = oFF.XString.substring(afterDecimal, 0, rightShiftCount);
			let second = oFF.XString.substring(afterDecimal, rightShiftCount, oFF.XString.size(afterDecimal));
			valueString = oFF.XStringUtils.concatenate4(beforeDecimal, first, ".", second);
		}
		return oFF.XNumberFormatter.stripLeadingZeros(valueString);
	},
	normalizeScientificFormat:function(value, decimalSeparator)
	{
			let patternString = "e";
		let expIdx = oFF.XString.indexOf(value, patternString);
		if (expIdx === -1)
		{
			patternString = "E";
			expIdx = oFF.XString.indexOf(value, patternString);
		}
		if (expIdx === -1)
		{
			return value;
		}
		let cleanedValue = oFF.XNumberFormatter.stripCharsFromNumber(value, decimalSeparator, expIdx);
		let tokenizedString = oFF.XList.create();
		for (let i = 0; i < oFF.XString.size(cleanedValue); i++)
		{
			let charToAdd = oFF.XNumberFormatter.convertAsciiToString(oFF.XString.getCharAt(cleanedValue, i));
			tokenizedString.add(charToAdd);
		}
		let expStrValue = oFF.XString.substring(value, expIdx, -1);
		let expValue = oFF.XInteger.convertFromStringWithRadix(oFF.XString.replace(expStrValue, patternString, ""), 10);
		let decSep = oFF.XNumberFormatter.convertAsciiToString(decimalSeparator);
		let currentDecSepPos = oFF.XString.indexOf(oFF.XString.replace(value, "-", ""), decSep);
		if (currentDecSepPos === -1)
		{
			currentDecSepPos = 1;
		}
		let newDecSepPos = currentDecSepPos + expValue;
		if (expValue >= 0)
		{
			while (newDecSepPos > tokenizedString.size())
			{
				tokenizedString.add("0");
			}
		}
		else
		{
			while (oFF.XString.size(cleanedValue) + expValue * -1 > tokenizedString.size())
			{
				tokenizedString.insert(0, "0");
			}
			newDecSepPos = currentDecSepPos + expValue;
			if (newDecSepPos < 0)
			{
				newDecSepPos = 1;
			}
		}
		if (newDecSepPos < tokenizedString.size())
		{
			tokenizedString.insert(newDecSepPos, decSep);
		}
		if (oFF.XString.startsWith(value, "-"))
		{
			tokenizedString.insert(0, "-");
		}
		let newStringValue = oFF.XStringBuffer.create();
		for (let n = 0; n < tokenizedString.size(); n++)
		{
			newStringValue.append(tokenizedString.get(n));
		}
		return newStringValue.toString();
	},
	normalizeScientificFormatString:function(value, decimalSeparator)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(value) && oFF.XStringUtils.isNotNullAndNotEmpty(decimalSeparator))
		{
			if (oFF.XString.isEqual(decimalSeparator, "."))
			{
				return oFF.XNumberFormatter.normalizeScientificFormat(value, oFF.XNumberFormatter.charDot);
			}
			if (oFF.XString.isEqual(decimalSeparator, ","))
			{
				return oFF.XNumberFormatter.normalizeScientificFormat(value, oFF.XNumberFormatter.charComma);
			}
		}
		return null;
	},
	round:function(value)
	{
			let result = oFF.XStringBuffer.create();
		let rest = 1;
		for (let i = oFF.XString.size(value) - 1; i >= 0; i--)
		{
			let currentChar = oFF.XString.getCharAt(value, i);
			if (currentChar < oFF.XNumberFormatter.char0 || currentChar > oFF.XNumberFormatter.char9)
			{
				result.append(oFF.XNumberFormatter.convertAsciiToString(currentChar));
				continue;
			}
			let charInt = oFF.XNumberFormatter.charToInt(currentChar);
			if (rest === 1)
			{
				charInt++;
			}
			if (charInt > 9)
			{
				charInt = 0;
				rest = 1;
			}
			else
			{
				rest = 0;
			}
			result.appendInt(charInt);
			if (i === 0 && rest === 1)
			{
				result.append("1");
			}
		}
		let resultString = result.toString();
		let length = result.length();
		oFF.XObjectExt.release(result);
		let returnValue = oFF.XStringBuffer.create();
		for (let y = length - 1; y >= 0; y--)
		{
			let currentChar1 = oFF.XNumberFormatter.convertAsciiToString(oFF.XString.getCharAt(resultString, y));
			returnValue.append(currentChar1);
		}
		return returnValue;
	},
	splitAround:function(str, splitChar)
	{
			let first = str;
		let second = null;
		let splitIndex = oFF.XString.indexOf(str, splitChar);
		if (splitIndex >= 0)
		{
			first = oFF.XString.substring(str, 0, splitIndex);
			second = oFF.XString.substring(str, splitIndex + 1, oFF.XString.size(str));
		}
		return oFF.XPairOfString.create(first, second);
	},
	standardizeFormatString:function(decimalPlaces, numeric)
	{
			let result = "";
		if (numeric)
		{
			let baseFormat = oFF.XNumberFormatter.STANDARD_EXCEL_FORMAT;
			if (decimalPlaces > 0)
			{
				baseFormat = oFF.XStringUtils.rightPad(oFF.XStringUtils.concatenate2(baseFormat, "."), "0", decimalPlaces);
			}
			result = baseFormat;
		}
		return result;
	},
	stripCharsFromNumber:function(value, decimalSeparator, expIdx)
	{
			let cleanedValue = oFF.XString.substring(value, 0, expIdx);
		let decSep = oFF.XNumberFormatter.convertAsciiToString(decimalSeparator);
		let decSepIdx = oFF.XString.indexOf(cleanedValue, decSep);
		if (decSepIdx > -1)
		{
			let currentValueStrSize = oFF.XString.size(cleanedValue);
			for (let j = currentValueStrSize - 1; j >= decSepIdx; j--)
			{
				let currentChar = oFF.XNumberFormatter.convertAsciiToString(oFF.XString.getCharAt(cleanedValue, j));
				if (oFF.XString.isEqual(currentChar, "0"))
				{
					cleanedValue = oFF.XString.substring(cleanedValue, 0, j);
				}
				else
				{
					break;
				}
			}
		}
		cleanedValue = oFF.XString.replace(cleanedValue, decSep, "");
		return oFF.XString.replace(cleanedValue, "-", "");
	},
	stripLeadingZeros:function(numericString)
	{
			let length = oFF.XString.size(numericString);
		let numLeading0s = 0;
		let nonZeroFound = false;
		for (let i = 0; i < length && !nonZeroFound; i++)
		{
			let c = oFF.XString.getCharAt(numericString, i);
			if (c === oFF.XNumberFormatter.char0)
			{
				numLeading0s++;
			}
			else
			{
				if (c === oFF.XNumberFormatter.charDot)
				{
					numLeading0s--;
				}
				nonZeroFound = true;
			}
		}
		if (!nonZeroFound)
		{
			numLeading0s--;
		}
		return numLeading0s > 0 ? oFF.XString.substring(numericString, numLeading0s, length) : numericString;
	},
	stripTailingZeros:function(numericString)
	{
			let length = oFF.XString.size(numericString);
		let numTailing0s = 0;
		let nonZeroFound = false;
		for (let i = length - 1; i >= 0 && !nonZeroFound; i--)
		{
			let c = oFF.XString.getCharAt(numericString, i);
			if (c === oFF.XNumberFormatter.char0)
			{
				numTailing0s++;
			}
			else
			{
				nonZeroFound = true;
			}
		}
		return numTailing0s > 0 ? oFF.XString.substring(numericString, 0, length - numTailing0s) : numericString;
	},
	wrapXlsString:function(str1, str2, str3)
	{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(str1) || oFF.XStringUtils.isNotNullAndNotEmpty(str2) || oFF.XStringUtils.isNotNullAndNotEmpty(str3))
		{
			return oFF.XStringUtils.concatenate5("\"", str1, str2, str3, "\"");
		}
		return "";
	}
};

oFF.ObservableValue = function() {};
oFF.ObservableValue.prototype = new oFF.XObject();
oFF.ObservableValue.prototype._ff_c = "ObservableValue";

oFF.ObservableValue.create = function()
{
	let obj = new oFF.ObservableValue();
	return obj;
};
oFF.ObservableValue.prototype.m_onChange = null;
oFF.ObservableValue.prototype.m_value = null;
oFF.ObservableValue.prototype.getValue = function()
{
	return this.m_value;
};
oFF.ObservableValue.prototype.isEqualValue = function(value)
{
	if (oFF.isNull(this.m_value))
	{
		return oFF.isNull(value);
	}
	if (oFF.isNull(value))
	{
		return false;
	}
	if (oFF.XString.isString(value))
	{
		return oFF.XString.isEqual(oFF.XString.asString(this.m_value), oFF.XString.asString(value));
	}
	if (!oFF.XObject.isOfClass(value, oFF.XClass.create(oFF.XObject)))
	{
		return false;
	}
	let oldValue = oFF.XObject.castToAny(this.m_value);
	let newValue = oFF.XObject.castToAny(value);
	return oFF.XObjectExt.areEqual(oldValue, newValue);
};
oFF.ObservableValue.prototype.releaseObject = function()
{
	this.m_value = null;
	this.m_onChange = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ObservableValue.prototype.setOnChange = function(onChange)
{
	this.m_onChange = onChange;
};
oFF.ObservableValue.prototype.setValue = function(newValue)
{
	if (this.isEqualValue(newValue))
	{
		return;
	}
	let oldValue = this.m_value;
	this.m_value = newValue;
	if (oFF.notNull(this.m_onChange))
	{
		this.m_onChange(oldValue, newValue);
	}
};
oFF.ObservableValue.prototype.setValueSilently = function(newValue)
{
	this.m_value = newValue;
};

oFF.Store = function() {};
oFF.Store.prototype = new oFF.XObject();
oFF.Store.prototype._ff_c = "Store";

oFF.Store.create = function(initialState, reducer)
{
	let newStore = new oFF.Store();
	newStore.m_currentState = initialState;
	newStore.m_reducer = reducer;
	newStore.m_consumers = oFF.XHashMapByString.create();
	return newStore;
};
oFF.Store.prototype.m_consumers = null;
oFF.Store.prototype.m_currentState = null;
oFF.Store.prototype.m_reducer = null;
oFF.Store.prototype.dispatch = function(action)
{
	if (!this.isReleased())
	{
		this.reduce(action);
		this.notifySubscribers();
	}
};
oFF.Store.prototype.generateUUID = function()
{
	return oFF.XStringUtils.concatenate2("ResourceExplorerSubscriberUuid_", oFF.XGuid.getGuid());
};
oFF.Store.prototype.getState = function()
{
	return this.m_currentState;
};
oFF.Store.prototype.notifySubscribers = function()
{
	let consumerIterator = this.m_consumers.getIterator();
	while (consumerIterator.hasNext())
	{
		let consumer = consumerIterator.next();
		if (!consumer.isReleased())
		{
			consumer.accept(this.m_currentState);
		}
	}
};
oFF.Store.prototype.reduce = function(action)
{
	this.m_currentState = this.m_reducer(action, this.m_currentState);
};
oFF.Store.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_currentState = oFF.XObjectExt.release(this.m_currentState);
	this.m_consumers = oFF.XObjectExt.release(this.m_consumers);
	this.m_reducer = null;
};
oFF.Store.prototype.subscribe = function(subscriber)
{
	let uuid = this.generateUUID();
	this.m_consumers.put(uuid, subscriber);
	return uuid;
};
oFF.Store.prototype.unsubscribe = function(subscriber)
{
	let keyIterator = this.m_consumers.getKeysAsIterator();
	while (keyIterator.hasNext())
	{
		let consumerKey = keyIterator.next();
		let consumer = this.m_consumers.getByKey(consumerKey);
		if (consumer === subscriber)
		{
			this.m_consumers.remove(consumerKey);
			return;
		}
	}
};
oFF.Store.prototype.unsubscribeBYUUID = function(subscriberId)
{
	this.m_consumers.remove(subscriberId);
};

oFF.RegistrationEntry = function() {};
oFF.RegistrationEntry.prototype = new oFF.XObject();
oFF.RegistrationEntry.prototype._ff_c = "RegistrationEntry";

oFF.RegistrationEntry.create = function()
{
	return new oFF.RegistrationEntry();
};
oFF.RegistrationEntry.prototype.m_class = null;
oFF.RegistrationEntry.prototype.m_serviceTypeName = null;
oFF.RegistrationEntry.prototype.getServiceTypeName = function()
{
	return this.m_serviceTypeName;
};
oFF.RegistrationEntry.prototype.getXClass = function()
{
	return this.m_class;
};
oFF.RegistrationEntry.prototype.releaseObject = function()
{
	this.m_class = null;
	this.m_serviceTypeName = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RegistrationEntry.prototype.setServiceTypeName = function(name)
{
	this.m_serviceTypeName = name;
};
oFF.RegistrationEntry.prototype.setXClass = function(clazz)
{
	this.m_class = clazz;
};
oFF.RegistrationEntry.prototype.toString = function()
{
	return this.m_serviceTypeName;
};

oFF.RegistrationService = function() {};
oFF.RegistrationService.prototype = new oFF.XObject();
oFF.RegistrationService.prototype._ff_c = "RegistrationService";

oFF.RegistrationService.COMMAND = "COMMAND";
oFF.RegistrationService.DEFAULT_NAME = "$$default$$";
oFF.RegistrationService.PROGRAM = "PROGRAM";
oFF.RegistrationService.SERVICE = "SERVICE";
oFF.RegistrationService.SERVICE_CONFIG = "SERVICE_CONFIG";
oFF.RegistrationService.WORKING_TASK_MGR = "WORKING_TASK_MGR";
oFF.RegistrationService.s_registrationService = null;
oFF.RegistrationService.getInstance = function()
{
	if (oFF.isNull(oFF.RegistrationService.s_registrationService))
	{
		oFF.RegistrationService.s_registrationService = new oFF.RegistrationService();
		oFF.RegistrationService.s_registrationService.setup();
	}
	return oFF.RegistrationService.s_registrationService;
};
oFF.RegistrationService.prototype.m_qualifiedReferences = null;
oFF.RegistrationService.prototype.m_references = null;
oFF.RegistrationService.prototype.addCommand = function(commandName, clazz)
{
	this.addCommandWithType("CUSTOM", commandName, clazz);
};
oFF.RegistrationService.prototype.addCommandWithType = function(commandType, commandName, clazz)
{
	let qualifiedCommandName = oFF.XStringUtils.concatenate3(commandType, ".", commandName);
	this.addReferenceWithType(oFF.RegistrationService.COMMAND, qualifiedCommandName, clazz);
};
oFF.RegistrationService.prototype.addReference = function(fullQualifiedName, clazz)
{
	let index = oFF.XString.indexOf(fullQualifiedName, ".");
	let type = oFF.XString.substring(fullQualifiedName, 0, index);
	let name = oFF.XString.substring(fullQualifiedName, index + 1, -1);
	this.addReferenceWithType(type, name, clazz);
};
oFF.RegistrationService.prototype.addReferenceWithType = function(type, name, clazz)
{
	let accessName = name;
	if (oFF.isNull(accessName))
	{
		accessName = oFF.RegistrationService.DEFAULT_NAME;
	}
	let serviceTypeName = oFF.XStringUtils.concatenate3(type, ".", accessName);
	if (!this.hasEntry(serviceTypeName, clazz))
	{
		let registrationEntry = oFF.RegistrationEntry.create();
		registrationEntry.setXClass(clazz);
		registrationEntry.setServiceTypeName(serviceTypeName);
		this.m_references.add(registrationEntry);
		let clazzMap = this.m_qualifiedReferences.getByKey(type);
		if (oFF.isNull(clazzMap))
		{
			clazzMap = oFF.XHashMapByString.create();
			this.m_qualifiedReferences.put(type, clazzMap);
		}
		let listOfClasses = clazzMap.getByKey(accessName);
		if (oFF.isNull(listOfClasses))
		{
			listOfClasses = oFF.XList.create();
			clazzMap.put(accessName, listOfClasses);
		}
		listOfClasses.add(clazz);
	}
};
oFF.RegistrationService.prototype.addService = function(name, clazz)
{
	this.addReferenceWithType(oFF.RegistrationService.SERVICE, name, clazz);
};
oFF.RegistrationService.prototype.addServiceConfig = function(name, clazz)
{
	this.addReferenceWithType(oFF.RegistrationService.SERVICE_CONFIG, name, clazz);
};
oFF.RegistrationService.prototype.addStudioProgram = function(name, clazz)
{
	this.addReferenceWithType(oFF.RegistrationService.PROGRAM, name, clazz);
};
oFF.RegistrationService.prototype.getFirstReference = function(type, name)
{
	let accessName = name;
	if (oFF.isNull(accessName))
	{
		accessName = oFF.RegistrationService.DEFAULT_NAME;
	}
	let classMap = this.m_qualifiedReferences.getByKey(type);
	if (oFF.notNull(classMap))
	{
		let classList = classMap.getByKey(accessName);
		if (oFF.XCollectionUtils.hasElements(classList))
		{
			return classList.get(0);
		}
	}
	return null;
};
oFF.RegistrationService.prototype.getLastReference = function(type, name)
{
	let accessName = name;
	if (oFF.isNull(accessName))
	{
		accessName = oFF.RegistrationService.DEFAULT_NAME;
	}
	let classMap = this.m_qualifiedReferences.getByKey(type);
	if (oFF.notNull(classMap))
	{
		let classList = classMap.getByKey(accessName);
		if (oFF.XCollectionUtils.hasElements(classList))
		{
			return classList.get(classList.size() - 1);
		}
	}
	return null;
};
oFF.RegistrationService.prototype.getReferences = function(fullQualifiedName)
{
	let registeredClasses = oFF.XList.create();
	for (let i = 0; i < this.m_references.size(); i++)
	{
		let reference = this.m_references.get(i);
		if (oFF.XString.isEqual(reference.getServiceTypeName(), fullQualifiedName))
		{
			registeredClasses.add(reference.getXClass());
		}
	}
	if (!oFF.XString.isEqual(fullQualifiedName, "RESULTSET_REQUEST_DECORATOR_PROVIDER.IMPLEMENTATION"))
	{
		oFF.XBooleanUtils.checkFalse(registeredClasses.isEmpty(), oFF.XStringUtils.concatenate2("RegistrationService.getRegisteredClassesForServiceName: no class found for service name ", fullQualifiedName));
	}
	return registeredClasses;
};
oFF.RegistrationService.prototype.hasEntry = function(serviceTypeName, clazz)
{
	for (let i = 0; i < this.m_references.size(); i++)
	{
		let reference = this.m_references.get(i);
		if (oFF.XString.isEqual(reference.getServiceTypeName(), serviceTypeName) && reference.getXClass() === clazz)
		{
			return true;
		}
	}
	return false;
};
oFF.RegistrationService.prototype.releaseObject = function()
{
	this.m_qualifiedReferences = oFF.XObjectExt.release(this.m_qualifiedReferences);
	this.m_references = oFF.XObjectExt.release(this.m_references);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RegistrationService.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_references = oFF.XList.create();
	this.m_qualifiedReferences = oFF.XHashMapByString.create();
};

oFF.TwoColumnBuffer = function() {};
oFF.TwoColumnBuffer.prototype = new oFF.XObject();
oFF.TwoColumnBuffer.prototype._ff_c = "TwoColumnBuffer";

oFF.TwoColumnBuffer.create = function()
{
	let newObj = new oFF.TwoColumnBuffer();
	newObj.setup();
	return newObj;
};
oFF.TwoColumnBuffer.prototype.m_currentColumn = null;
oFF.TwoColumnBuffer.prototype.m_currentLine = null;
oFF.TwoColumnBuffer.prototype.m_lines = null;
oFF.TwoColumnBuffer.prototype.m_spaceCount = 0;
oFF.TwoColumnBuffer.prototype.append = function(value)
{
	this.m_currentColumn.append(value);
	return this;
};
oFF.TwoColumnBuffer.prototype.appendBoolean = function(value)
{
	this.m_currentColumn.appendBoolean(value);
	return this;
};
oFF.TwoColumnBuffer.prototype.appendChar = function(value)
{
	this.m_currentColumn.appendChar(value);
	return this;
};
oFF.TwoColumnBuffer.prototype.appendDouble = function(value)
{
	this.m_currentColumn.appendDouble(value);
	return this;
};
oFF.TwoColumnBuffer.prototype.appendInt = function(value)
{
	this.m_currentColumn.appendInt(value);
	return this;
};
oFF.TwoColumnBuffer.prototype.appendLine = function(value)
{
	this.m_currentColumn.append(value);
	this.appendNewLine();
	return this;
};
oFF.TwoColumnBuffer.prototype.appendLong = function(value)
{
	this.m_currentColumn.appendLong(value);
	return this;
};
oFF.TwoColumnBuffer.prototype.appendNewLine = function()
{
	this.m_currentLine = oFF.XPair.create(oFF.XStringBuffer.create(), oFF.XStringBuffer.create());
	this.m_currentColumn = this.m_currentLine.getFirstObject();
	this.m_lines.add(this.m_currentLine);
	return this;
};
oFF.TwoColumnBuffer.prototype.appendObject = function(value)
{
	this.m_currentColumn.appendObject(value);
	return this;
};
oFF.TwoColumnBuffer.prototype.clear = function()
{
	this.m_lines = oFF.XList.create();
	this.appendNewLine();
};
oFF.TwoColumnBuffer.prototype.flush = function() {};
oFF.TwoColumnBuffer.prototype.length = function()
{
	let value = this.toString();
	return oFF.XString.size(value);
};
oFF.TwoColumnBuffer.prototype.nextColumn = function()
{
	this.m_currentColumn = this.m_currentLine.getSecondObject();
	return this;
};
oFF.TwoColumnBuffer.prototype.setup = function()
{
	this.clear();
	this.m_spaceCount = 2;
};
oFF.TwoColumnBuffer.prototype.toString = function()
{
	let maxWidthCol0 = 0;
	let pair;
	let column0;
	let len;
	for (let i = 0; i < this.m_lines.size(); i++)
	{
		pair = this.m_lines.get(i);
		column0 = pair.getFirstObject();
		len = column0.length();
		if (len > maxWidthCol0)
		{
			maxWidthCol0 = len;
		}
	}
	let target = oFF.XStringBuffer.create();
	for (let j = 0; j < this.m_lines.size(); j++)
	{
		if (j > 0)
		{
			target.appendNewLine();
		}
		pair = this.m_lines.get(j);
		column0 = pair.getFirstObject();
		target.append(column0.toString());
		len = column0.length();
		for (let k = len; k < maxWidthCol0 + this.m_spaceCount; k++)
		{
			target.append(" ");
		}
		target.append(pair.getSecondObject().toString());
	}
	return target.toString();
};

oFF.XPattern = {

	matches:function(value, pattern)
	{
			if (oFF.XStringUtils.isNullOrEmpty(value) || oFF.XStringUtils.isNullOrEmpty(pattern))
		{
			return false;
		}
		let testValue = oFF.XString.toLowerCase(value);
		let testPattern = oFF.XString.toLowerCase(pattern);
		let patternParts = oFF.XStringTokenizer.splitString(testPattern, "*");
		for (let i = 0; i < patternParts.size(); i++)
		{
			let part = patternParts.get(i);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(part))
			{
				if (i === 0)
				{
					if (!oFF.XString.startsWith(testValue, part))
					{
						return false;
					}
				}
				else if (i === patternParts.size() - 1)
				{
					if (!oFF.XString.endsWith(testValue, part))
					{
						return false;
					}
				}
				else if (!oFF.XString.containsString(testValue, part))
				{
					return false;
				}
				let endIndexOfPatternInTestname = oFF.XString.indexOf(testValue, part) + oFF.XString.size(part);
				testValue = oFF.XString.substring(testValue, endIndexOfPatternInTestname, oFF.XString.size(testValue));
			}
		}
		return true;
	}
};

oFF.XGeometryValue = function() {};
oFF.XGeometryValue.prototype = new oFF.XObject();
oFF.XGeometryValue.prototype._ff_c = "XGeometryValue";

oFF.XGeometryValue.createGeometryValueWithWkt = function(wkt)
{
	let point = oFF.XPointValue.createWithWkt(wkt);
	if (oFF.notNull(point))
	{
		return point;
	}
	let multiPoint = oFF.XMultiPointValue.createWithWkt(wkt);
	if (oFF.notNull(multiPoint))
	{
		return multiPoint;
	}
	let polygon = oFF.XPolygonValue.createWithWkt(wkt);
	if (oFF.notNull(polygon))
	{
		return polygon;
	}
	let multiPolygon = oFF.XMultiPolygonValue.createWithWkt(wkt);
	if (oFF.notNull(multiPolygon))
	{
		return multiPolygon;
	}
	let lineString = oFF.XLineStringValue.createWithWkt(wkt);
	if (oFF.notNull(lineString))
	{
		return lineString;
	}
	let multiLineString = oFF.XMultiLineStringValue.createWithWkt(wkt);
	if (oFF.notNull(multiLineString))
	{
		return multiLineString;
	}
	return null;
};

oFF.XValueUtil = function() {};
oFF.XValueUtil.prototype = new oFF.XObject();
oFF.XValueUtil.prototype._ff_c = "XValueUtil";

oFF.XValueUtil.convertValue = function(originalValue, targetValueType)
{
	return oFF.XValueUtil.convertValueExt(originalValue, targetValueType, false);
};
oFF.XValueUtil.convertValueExt = function(originalValue, targetValueType, strict)
{
	let retVal;
	if (oFF.isNull(originalValue))
	{
		retVal = null;
	}
	else if (originalValue.getValueType() === targetValueType)
	{
		retVal = originalValue;
	}
	else if (targetValueType.isString())
	{
		retVal = oFF.XStringValue.create(originalValue.getStringRepresentation());
	}
	else if (targetValueType === oFF.XValueType.BOOLEAN)
	{
		retVal = oFF.XBooleanValue.create(oFF.XValueUtil.getBoolean(originalValue, strict, false));
	}
	else if (targetValueType === oFF.XValueType.INTEGER)
	{
		retVal = oFF.XIntegerValue.create(oFF.XValueUtil.getInteger(originalValue, strict, false));
	}
	else if (targetValueType === oFF.XValueType.LONG)
	{
		retVal = oFF.XLongValue.create(oFF.XValueUtil.getLong(originalValue, strict, false));
	}
	else if (targetValueType === oFF.XValueType.TIMESPAN)
	{
		retVal = oFF.XTimeSpan.create(oFF.XValueUtil.getLong(originalValue, strict, false));
	}
	else if (targetValueType === oFF.XValueType.DOUBLE)
	{
		retVal = oFF.XDoubleValue.create(oFF.XValueUtil.getDouble(originalValue, strict, false));
	}
	else if (targetValueType === oFF.XValueType.DECIMAL_FLOAT)
	{
		if (originalValue.getValueType().isNumber())
		{
			retVal = oFF.XDecFloatByDouble.create(oFF.XValueUtil.getDouble(originalValue, strict, false));
		}
		else
		{
			retVal = oFF.XDecFloatByString.create(originalValue.getStringRepresentation());
		}
	}
	else if (targetValueType === oFF.XValueType.DATE)
	{
		retVal = oFF.XDate.createDateSafe(originalValue.getStringRepresentation());
	}
	else if (targetValueType === oFF.XValueType.TIME)
	{
		retVal = oFF.XTime.createTimeSafe(originalValue.getStringRepresentation());
	}
	else if (targetValueType === oFF.XValueType.DATE_TIME)
	{
		retVal = oFF.XDateTime.createDateTimeSafe(originalValue.getStringRepresentation());
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate4("Value of type ", originalValue.getValueType().toString(), " cannot by converted to type ", targetValueType.toString()));
	}
	return retVal;
};
oFF.XValueUtil.convertValueStrict = function(originalValue, targetValueType)
{
	return oFF.XValueUtil.convertValueExt(originalValue, targetValueType, true);
};
oFF.XValueUtil.convertValueStrictSilent = function(originalValue, targetValueType)
{
	try
	{
		return oFF.XValueUtil.convertValueStrict(originalValue, targetValueType);
	}
	catch (t)
	{
		return null;
	}
};
oFF.XValueUtil.copyValue = function(xValue)
{
	if (oFF.isNull(xValue))
	{
		return null;
	}
	let targetValueType = xValue.getValueType();
	if (targetValueType === oFF.XValueType.STRING)
	{
		return oFF.XStringValue.create(oFF.XValueUtil.getString(xValue));
	}
	if (targetValueType === oFF.XValueType.DOUBLE)
	{
		return oFF.XDoubleValue.create(xValue.getDouble());
	}
	if (targetValueType === oFF.XValueType.DECIMAL_FLOAT)
	{
		let decFloatValue = xValue;
		if (decFloatValue.mayLoosePrecision())
		{
			return oFF.XDecFloatByDouble.create(decFloatValue.getDouble());
		}
		else
		{
			return oFF.XDecFloatByString.create(decFloatValue.getStringRepresentation());
		}
	}
	if (targetValueType === oFF.XValueType.LONG)
	{
		return oFF.XLongValue.create(xValue.getLong());
	}
	if (targetValueType === oFF.XValueType.INTEGER)
	{
		return oFF.XIntegerValue.create(xValue.getInteger());
	}
	if (targetValueType === oFF.XValueType.DATE)
	{
		return oFF.XDate.createDateSafe(xValue.getStringRepresentation());
	}
	if (targetValueType === oFF.XValueType.TIME)
	{
		return oFF.XTime.createTimeSafe(xValue.getStringRepresentation());
	}
	if (targetValueType === oFF.XValueType.DATE_TIME)
	{
		return oFF.XDateTime.createDateTimeSafe(xValue.getStringRepresentation());
	}
	if (targetValueType === oFF.XValueType.BOOLEAN)
	{
		return oFF.XBooleanValue.create(xValue.getBoolean());
	}
	if (targetValueType === oFF.XValueType.TIMESPAN)
	{
		return oFF.XTimeSpan.create(oFF.XLong.convertFromString(xValue.getStringRepresentation()));
	}
	if (targetValueType.isSpatial())
	{
		return oFF.XGeometryValue.createGeometryValueWithWkt(xValue.getStringRepresentation());
	}
	oFF.noSupport();
};
oFF.XValueUtil.getBoolean = function(value, strict, silent)
{
	if (oFF.isNull(value))
	{
		return false;
	}
	let valueType = value.getValueType();
	if (valueType === oFF.XValueType.BOOLEAN)
	{
		return value.getBoolean();
	}
	if (!strict)
	{
		if (valueType === oFF.XValueType.INTEGER)
		{
			return value.getInteger() !== 0;
		}
		if (valueType === oFF.XValueType.LONG)
		{
			return value.getLong() !== 0;
		}
		if (valueType === oFF.XValueType.DOUBLE)
		{
			return value.getDouble() !== 0.0;
		}
		if (valueType === oFF.XValueType.DECIMAL_FLOAT)
		{
			return value.getDouble() !== 0.0;
		}
		if (valueType === oFF.XValueType.STRING)
		{
			return oFF.XString.isEqual(oFF.XString.toUpperCase(oFF.XString.trim(value.getStringRepresentation())), "TRUE");
		}
	}
	if (silent)
	{
		return false;
	}
	throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate5("Value ", value.getStringRepresentation(), " of type ", value.getValueType().toString(), " cannot by converted to Boolean"));
};
oFF.XValueUtil.getDecFloat = function(value, strict, silent)
{
	let retValue = null;
	if (oFF.notNull(value))
	{
		let valueType = value.getValueType();
		if (valueType === oFF.XValueType.DECIMAL_FLOAT)
		{
			retValue = value;
		}
		else if (value.getValueType().isNumber())
		{
			let doubleValue = oFF.XValueUtil.getDouble(value, strict, silent);
			retValue = oFF.XDecFloatByDouble.create(doubleValue);
		}
		else
		{
			retValue = oFF.XDecFloatByString.create(value.getStringRepresentation());
		}
	}
	return retValue;
};
oFF.XValueUtil.getDouble = function(value, strict, silent)
{
	let retValue = 0.0;
	if (oFF.notNull(value))
	{
		let valueType = value.getValueType();
		if (valueType === oFF.XValueType.DOUBLE)
		{
			retValue = value.getDouble();
		}
		else if (valueType === oFF.XValueType.BOOLEAN)
		{
			retValue = value.getBoolean() ? 1.0 : 0.0;
		}
		else if (valueType === oFF.XValueType.INTEGER)
		{
			retValue = oFF.XInteger.convertToDouble(value.getInteger());
		}
		else if (valueType === oFF.XValueType.LONG)
		{
			retValue = oFF.XLong.convertToDouble(value.getLong());
		}
		else if (valueType === oFF.XValueType.TIMESPAN)
		{
			retValue = oFF.XLong.convertToDouble(value.getTimeSpan());
		}
		else if (valueType === oFF.XValueType.DECIMAL_FLOAT)
		{
			retValue = value.getDouble();
		}
		else if (!strict)
		{
			try
			{
				retValue = oFF.XDouble.convertFromString(value.getStringRepresentation());
			}
			catch (t)
			{
				retValue = oFF.XValueUtil.report(silent, value, oFF.XValueType.DOUBLE);
			}
		}
		else
		{
			retValue = oFF.XValueUtil.report(silent, value, oFF.XValueType.DOUBLE);
		}
	}
	return retValue;
};
oFF.XValueUtil.getInteger = function(value, strict, silent)
{
	if (oFF.isNull(value))
	{
		return 0;
	}
	let valueType = value.getValueType();
	if (valueType === oFF.XValueType.BOOLEAN)
	{
		return value.getBoolean() ? 1 : 0;
	}
	if (valueType === oFF.XValueType.INTEGER)
	{
		return value.getInteger();
	}
	if (!strict)
	{
		if (valueType === oFF.XValueType.LONG)
		{
			return oFF.XLong.convertToInt(value.getLong());
		}
		if (valueType === oFF.XValueType.TIMESPAN)
		{
			return oFF.XLong.convertToInt(value.getTimeSpan());
		}
		if (valueType === oFF.XValueType.DOUBLE)
		{
			return oFF.XDouble.convertToInt(value.getDouble());
		}
		if (valueType === oFF.XValueType.DECIMAL_FLOAT)
		{
			return oFF.XDouble.convertToInt(value.getDouble());
		}
		try
		{
			return oFF.XInteger.convertFromString(value.getStringRepresentation());
		}
		catch (t)
		{
			return oFF.XValueUtil.report(silent, value, oFF.XValueType.INTEGER);
		}
	}
	return oFF.XValueUtil.report(silent, value, oFF.XValueType.INTEGER);
};
oFF.XValueUtil.getLong = function(value, strict, silent)
{
	if (oFF.isNull(value))
	{
		return 0;
	}
	let valueType = value.getValueType();
	if (valueType === oFF.XValueType.BOOLEAN)
	{
		return value.getBoolean() ? 1 : 0;
	}
	if (valueType === oFF.XValueType.INTEGER)
	{
		return value.getInteger();
	}
	if (valueType === oFF.XValueType.LONG)
	{
		return value.getLong();
	}
	if (valueType === oFF.XValueType.TIMESPAN)
	{
		return value.getTimeSpan();
	}
	if (!strict)
	{
		if (valueType === oFF.XValueType.DOUBLE)
		{
			return oFF.XDouble.convertToLong(value.getDouble());
		}
		if (valueType === oFF.XValueType.DECIMAL_FLOAT)
		{
			return oFF.XDouble.convertToLong(value.getDouble());
		}
		try
		{
			return oFF.XLong.convertFromString(value.getStringRepresentation());
		}
		catch (t)
		{
			return oFF.XValueUtil.report(silent, value, oFF.XValueType.LONG);
		}
	}
	return oFF.XValueUtil.report(silent, value, oFF.XValueType.LONG);
};
oFF.XValueUtil.getString = function(value)
{
	if (oFF.isNull(value))
	{
		return null;
	}
	return value.getStringRepresentation();
};
oFF.XValueUtil.getValueFromString = function(stringRepresentation, targetValueType)
{
	if (oFF.isNull(stringRepresentation))
	{
		return null;
	}
	if (targetValueType === oFF.XValueType.STRING)
	{
		return oFF.XStringValue.create(stringRepresentation);
	}
	if (targetValueType === oFF.XValueType.DOUBLE)
	{
		return oFF.XDoubleValue.create(oFF.XDouble.convertFromString(stringRepresentation));
	}
	if (targetValueType === oFF.XValueType.DECIMAL_FLOAT)
	{
		return oFF.XDecFloatByString.create(stringRepresentation);
	}
	if (targetValueType === oFF.XValueType.LONG)
	{
		return oFF.XLongValue.create(oFF.XLong.convertFromString(stringRepresentation));
	}
	if (targetValueType === oFF.XValueType.INTEGER)
	{
		return oFF.XIntegerValue.create(oFF.XInteger.convertFromStringWithRadix(stringRepresentation, 10));
	}
	if (targetValueType === oFF.XValueType.DATE)
	{
		return oFF.XDate.createDateSafe(stringRepresentation);
	}
	if (targetValueType === oFF.XValueType.TIME)
	{
		return oFF.XTime.createTimeSafe(stringRepresentation);
	}
	if (targetValueType === oFF.XValueType.DATE_TIME)
	{
		return oFF.XDateTime.createDateTimeSafe(stringRepresentation);
	}
	if (targetValueType === oFF.XValueType.BOOLEAN)
	{
		return oFF.XBooleanValue.create(oFF.XBoolean.convertFromString(stringRepresentation));
	}
	if (targetValueType === oFF.XValueType.TIMESPAN)
	{
		return oFF.XTimeSpan.create(oFF.XLong.convertFromString(stringRepresentation));
	}
	if (targetValueType.isSpatial())
	{
		return oFF.XGeometryValue.createGeometryValueWithWkt(stringRepresentation);
	}
	oFF.noSupport();
};
oFF.XValueUtil.report = function(silent, value, type)
{
	if (silent)
	{
		return 0;
	}
	throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate5(value.getStringRepresentation(), " of type ", value.getValueType().toString(), " cannot by converted to ", type.getName()));
};

oFF.XDateTimeFormatter = function() {};
oFF.XDateTimeFormatter.prototype = new oFF.XObject();
oFF.XDateTimeFormatter.prototype._ff_c = "XDateTimeFormatter";

oFF.XDateTimeFormatter.create = function(formatString)
{
	let dateFormatter = new oFF.XDateTimeFormatter();
	dateFormatter.compileFormat(formatString);
	return dateFormatter;
};
oFF.XDateTimeFormatter.prototype.separators = null;
oFF.XDateTimeFormatter.prototype.tokens = null;
oFF.XDateTimeFormatter.prototype.applyPattern = function(format)
{
	this.compileFormat(format);
};
oFF.XDateTimeFormatter.prototype.compileFormat = function(formatString)
{
	this.tokens = oFF.XObjectExt.release(this.tokens);
	this.separators = oFF.XObjectExt.release(this.separators);
	this.tokens = oFF.XList.create();
	this.separators = oFF.XList.create();
	let currentIndex = 0;
	let endIndex = this.indexOfNextSeparatorOrNextToken(formatString, oFF.DateFormatterConstants.ALLOWED_SEPARATORS, currentIndex);
	while (endIndex !== -1)
	{
		this.createToken(formatString, currentIndex, endIndex);
		if (!oFF.DateFormatterConstants.ALLOWED_SEPARATORS.contains(oFF.XString.substring(formatString, endIndex, endIndex + 1)))
		{
			currentIndex = endIndex;
		}
		else
		{
			let separator = "";
			while (oFF.DateFormatterConstants.ALLOWED_SEPARATORS.contains(oFF.XString.substring(formatString, endIndex, endIndex + 1)))
			{
				separator = oFF.XStringUtils.concatenate2(separator, oFF.XString.substring(formatString, endIndex, endIndex + 1));
				currentIndex = endIndex + 1;
				endIndex = endIndex + 1;
			}
			this.separators.add(oFF.XStringValue.create(separator));
		}
		endIndex = this.indexOfNextSeparatorOrNextToken(formatString, oFF.DateFormatterConstants.ALLOWED_SEPARATORS, currentIndex);
	}
	this.createToken(formatString, currentIndex, oFF.XString.size(formatString));
};
oFF.XDateTimeFormatter.prototype.createToken = function(formatString, beginIndex, endIndex)
{
	let tokenString = oFF.XString.substring(formatString, beginIndex, beginIndex + 1);
	if (!oFF.DateFormatterConstants.isTokenValid(tokenString))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Invalid token: ", tokenString));
	}
	if (oFF.XString.isEqual(tokenString, oFF.DateFormatterConstants.TIMEZONE_TOKEN))
	{
		this.tokens.add(oFF.XTimeZoneFormatToken.create(endIndex - beginIndex));
	}
	else if (oFF.XString.isEqual(tokenString, oFF.DateFormatterConstants.MONTH_TOKEN) && endIndex - beginIndex === 3)
	{
		this.tokens.add(oFF.XMonthStringToken.create());
	}
	else if (oFF.XString.isEqual(tokenString, oFF.DateFormatterConstants.AMPM_TOKEN))
	{
		this.tokens.add(oFF.XAmPmFormatToken.create(false));
	}
	else if (oFF.XString.isEqual(tokenString, oFF.DateFormatterConstants.AMPM_TOKEN_CAP))
	{
		this.tokens.add(oFF.XAmPmFormatToken.create(true));
	}
	else
	{
		this.tokens.add(oFF.XNumericFormatToken.create(tokenString, endIndex - beginIndex));
	}
};
oFF.XDateTimeFormatter.prototype.formatDate = function(date)
{
	let dateTime = oFF.XDateTime.createWithYearMonthDay(date.getYear(), date.getMonthOfYear(), date.getDayOfMonth());
	return this.formatDateTime(dateTime);
};
oFF.XDateTimeFormatter.prototype.formatDateTime = function(dateTime)
{
	let dateTimeStringBuffer = oFF.XStringBuffer.create();
	for (let i = 0; i < this.tokens.size(); i++)
	{
		let token = this.tokens.get(i);
		dateTimeStringBuffer.append(token.getDateTimeElementString(dateTime));
		if (i < this.separators.size())
		{
			dateTimeStringBuffer.append(this.separators.get(i).getString());
		}
	}
	return dateTimeStringBuffer.toString();
};
oFF.XDateTimeFormatter.prototype.formatTime = function(time)
{
	let dateTime = oFF.XDateTime.createHollowDateTime();
	dateTime.setHourOfDay(time.getHourOfDay());
	dateTime.setMinuteOfHour(time.getMinuteOfHour());
	dateTime.setSecondOfMinute(time.getSecondOfMinute());
	dateTime.setMillisecondOfSecond(time.getMillisecondOfSecond());
	return this.formatDateTime(dateTime);
};
oFF.XDateTimeFormatter.prototype.indexOfNextSeparatorOrNextToken = function(stringToSearch, separators, from)
{
	let prevChar = 0;
	for (let charAt = from; charAt < oFF.XString.size(stringToSearch); charAt++)
	{
		if (separators.contains(oFF.XString.substring(stringToSearch, charAt, charAt + 1)))
		{
			return charAt;
		}
		if (prevChar !== 0 && prevChar !== oFF.XString.getCharAt(stringToSearch, charAt))
		{
			return charAt;
		}
		prevChar = oFF.XString.getCharAt(stringToSearch, charAt);
	}
	return -1;
};
oFF.XDateTimeFormatter.prototype.parse = function(dateString)
{
	let dateTime = oFF.XDateTime.createHollowDateTime();
	let currentIndex = 0;
	for (let i = 0; i < this.tokens.size(); i++)
	{
		let token = this.tokens.get(i);
		token.setDateTimeElementValue(dateTime, dateString, currentIndex);
		let separatorSize = i < this.separators.size() ? oFF.XString.size(this.separators.get(i).getString()) : 0;
		currentIndex = currentIndex + token.getSize() + separatorSize;
	}
	return dateTime;
};

oFF.XBaseCalendarDate = function() {};
oFF.XBaseCalendarDate.prototype = new oFF.XCalendarDate();
oFF.XBaseCalendarDate.prototype._ff_c = "XBaseCalendarDate";

oFF.XBaseCalendarDate.prototype.m_cachedFixedDateJan1 = 731581;
oFF.XBaseCalendarDate.prototype.m_cachedFixedDateNextJan1 = 0;
oFF.XBaseCalendarDate.prototype.m_cachedYear = 2004;
oFF.XBaseCalendarDate.prototype.getCachedJan1 = function()
{
	return this.m_cachedFixedDateJan1;
};
oFF.XBaseCalendarDate.prototype.getCachedYear = function()
{
	return this.m_cachedYear;
};
oFF.XBaseCalendarDate.prototype.hit = function(year)
{
	return year === this.m_cachedYear;
};
oFF.XBaseCalendarDate.prototype.hitFixedDate = function(fixedDate)
{
	return (fixedDate >= this.m_cachedFixedDateJan1 && fixedDate < this.m_cachedFixedDateNextJan1);
};
oFF.XBaseCalendarDate.prototype.setCache = function(year, jan1, len)
{
	this.m_cachedYear = year;
	this.m_cachedFixedDateJan1 = jan1;
	this.m_cachedFixedDateNextJan1 = len;
};
oFF.XBaseCalendarDate.prototype.setup = function()
{
	oFF.XCalendarDate.prototype.setup.call( this );
	this.m_cachedFixedDateNextJan1 = this.m_cachedFixedDateJan1 + 366;
};

oFF.ListenerPair = function() {};
oFF.ListenerPair.prototype = new oFF.XObject();
oFF.ListenerPair.prototype._ff_c = "ListenerPair";

oFF.ListenerPair.create = function(listener, customIdentifier)
{
	let element = new oFF.ListenerPair();
	element.setupExt(listener, customIdentifier);
	return element;
};
oFF.ListenerPair.prototype.m_customIdentifier = null;
oFF.ListenerPair.prototype.m_listenerWeakReference = null;
oFF.ListenerPair.prototype.getCustomIdentifier = function()
{
	return this.m_customIdentifier;
};
oFF.ListenerPair.prototype.getListener = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_listenerWeakReference);
};
oFF.ListenerPair.prototype.hasWeakReference = function()
{
	return oFF.notNull(this.m_listenerWeakReference);
};
oFF.ListenerPair.prototype.releaseObject = function()
{
	this.m_listenerWeakReference = null;
	this.m_customIdentifier = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ListenerPair.prototype.setCustomIdentifier = function(customIdentifier)
{
	this.m_customIdentifier = customIdentifier;
};
oFF.ListenerPair.prototype.setupExt = function(listener, customIdentifier)
{
	this.m_listenerWeakReference = oFF.XWeakReferenceUtil.getWeakRef(listener);
	this.m_customIdentifier = customIdentifier;
};
oFF.ListenerPair.prototype.toString = function()
{
	if (oFF.isNull(this.m_listenerWeakReference))
	{
		return "[Empty]";
	}
	return this.m_listenerWeakReference.toString();
};

oFF.ExtResult = function() {};
oFF.ExtResult.prototype = new oFF.XObject();
oFF.ExtResult.prototype._ff_c = "ExtResult";

oFF.ExtResult.create = function(data, messages)
{
	let list = new oFF.ExtResult();
	list.setupExt(data, messages, false);
	return list;
};
oFF.ExtResult.createCopyExt = function(other)
{
	let newObj = new oFF.ExtResult();
	if (oFF.isNull(other))
	{
		newObj.setupExt(null, null, false);
	}
	else
	{
		newObj.setupExt(other.getData(), other, false);
	}
	return newObj;
};
oFF.ExtResult.createEmpty = function()
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	let newObj = new oFF.ExtResult();
	newObj.setupExt(null, messageManager, false);
	return newObj;
};
oFF.ExtResult.createWithErrorMessage = function(errorMessage)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	messageManager.addError(oFF.ErrorCodes.OTHER_ERROR, errorMessage);
	let newObj = new oFF.ExtResult();
	newObj.setupExt(null, messageManager, false);
	return newObj;
};
oFF.ExtResult.createWithExternalMessages = function(data, messages)
{
	let newObj = new oFF.ExtResult();
	newObj.setupExt(data, messages, true);
	return newObj;
};
oFF.ExtResult.createWithInfoMessage = function(infoMessage)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	messageManager.addInfo(oFF.ErrorCodes.OTHER_ERROR, infoMessage);
	let newObj = new oFF.ExtResult();
	newObj.setupExt(null, messageManager, false);
	return newObj;
};
oFF.ExtResult.createWithMessage = function(message)
{
	let messageManager = oFF.MessageManagerSimple.createMessageManager();
	messageManager.addMessage(message);
	let newObj = new oFF.ExtResult();
	newObj.setupExt(null, messageManager, false);
	return newObj;
};
oFF.ExtResult.prototype.m_data = null;
oFF.ExtResult.prototype.m_messageCollection = null;
oFF.ExtResult.prototype.containsCode = function(severity, code)
{
	return this.m_messageCollection.containsCode(severity, code);
};
oFF.ExtResult.prototype.getClientStatusCode = function()
{
	return this.m_messageCollection.getClientStatusCode();
};
oFF.ExtResult.prototype.getData = function()
{
	return this.m_data;
};
oFF.ExtResult.prototype.getErrors = function()
{
	return this.m_messageCollection.getErrors();
};
oFF.ExtResult.prototype.getFirstError = function()
{
	return this.m_messageCollection.getFirstError();
};
oFF.ExtResult.prototype.getFirstWithSeverity = function(severity)
{
	return this.m_messageCollection.getFirstWithSeverity(severity);
};
oFF.ExtResult.prototype.getInfos = function()
{
	return this.m_messageCollection.getInfos();
};
oFF.ExtResult.prototype.getMessage = function(severity, code)
{
	return this.m_messageCollection.getMessage(severity, code);
};
oFF.ExtResult.prototype.getMessages = function()
{
	return this.m_messageCollection.getMessages();
};
oFF.ExtResult.prototype.getNumberOfErrors = function()
{
	return this.m_messageCollection.getNumberOfErrors();
};
oFF.ExtResult.prototype.getNumberOfSeverity = function(severity)
{
	return this.m_messageCollection.getNumberOfSeverity(severity);
};
oFF.ExtResult.prototype.getNumberOfWarnings = function()
{
	return this.m_messageCollection.getNumberOfWarnings();
};
oFF.ExtResult.prototype.getRootProfileNode = function()
{
	return this.m_messageCollection.getRootProfileNode();
};
oFF.ExtResult.prototype.getSemanticalErrors = function()
{
	return this.m_messageCollection.getSemanticalErrors();
};
oFF.ExtResult.prototype.getServerStatusCode = function()
{
	return this.m_messageCollection.getServerStatusCode();
};
oFF.ExtResult.prototype.getServerStatusDetails = function()
{
	return this.m_messageCollection.getServerStatusDetails();
};
oFF.ExtResult.prototype.getSummary = function()
{
	return this.m_messageCollection.getSummary();
};
oFF.ExtResult.prototype.getWarnings = function()
{
	return this.m_messageCollection.getWarnings();
};
oFF.ExtResult.prototype.hasErrors = function()
{
	return this.m_messageCollection.hasErrors();
};
oFF.ExtResult.prototype.hasSeverity = function(severity)
{
	return this.m_messageCollection.hasSeverity(severity);
};
oFF.ExtResult.prototype.hasWarnings = function()
{
	return this.m_messageCollection.hasWarnings();
};
oFF.ExtResult.prototype.isValid = function()
{
	return this.m_messageCollection.isValid();
};
oFF.ExtResult.prototype.releaseObject = function()
{
	this.m_data = null;
	this.m_messageCollection = oFF.XObjectExt.release(this.m_messageCollection);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ExtResult.prototype.setupExt = function(data, messages, externalMessages)
{
	this.m_data = data;
	if (externalMessages && oFF.notNull(messages))
	{
		this.m_messageCollection = messages;
	}
	else
	{
		this.m_messageCollection = oFF.MessageManagerSimple.createMessageManager();
		if (oFF.notNull(messages))
		{
			this.m_messageCollection.copyAllMessages(messages);
		}
	}
};
oFF.ExtResult.prototype.toString = function()
{
	return this.m_messageCollection.toString();
};

oFF.XCurrencyFormatSettings = function() {};
oFF.XCurrencyFormatSettings.prototype = new oFF.XObject();
oFF.XCurrencyFormatSettings.prototype._ff_c = "XCurrencyFormatSettings";

oFF.XCurrencyFormatSettings.create = function()
{
	return new oFF.XCurrencyFormatSettings();
};
oFF.XCurrencyFormatSettings.createDefault = function()
{
	let settings = oFF.XCurrencyFormatSettings.create();
	settings.setCurrencyPresentationPosition(2);
	settings.setValuePosition(0);
	settings.setScaleTextPosition(1);
	settings.setCurrencyPresentationHasSpace(true);
	settings.setScaleTextHasSpace(true);
	return settings;
};
oFF.XCurrencyFormatSettings.prototype.m_currencyPresentation = null;
oFF.XCurrencyFormatSettings.prototype.m_currencyPresentationHasSpace = null;
oFF.XCurrencyFormatSettings.prototype.m_currencyPresentationPosition = -1;
oFF.XCurrencyFormatSettings.prototype.m_scaleTextHasSpace = null;
oFF.XCurrencyFormatSettings.prototype.m_scaleTextPosition = -1;
oFF.XCurrencyFormatSettings.prototype.m_valuePosition = -1;
oFF.XCurrencyFormatSettings.prototype.currencyPresentationHasSpace = function()
{
	return oFF.TriStateBool.getBooleanWithFallback(this.m_currencyPresentationHasSpace, false);
};
oFF.XCurrencyFormatSettings.prototype.currencyPresentationSpaceSettingExplicit = function()
{
	return oFF.TriStateBool.isExplicitBooleanValue(this.m_currencyPresentationHasSpace);
};
oFF.XCurrencyFormatSettings.prototype.getCurrencyPresentation = function()
{
	return this.m_currencyPresentation;
};
oFF.XCurrencyFormatSettings.prototype.getCurrencyPresentationPosition = function()
{
	return this.m_currencyPresentationPosition;
};
oFF.XCurrencyFormatSettings.prototype.getScaleTextPosition = function()
{
	return this.m_scaleTextPosition;
};
oFF.XCurrencyFormatSettings.prototype.getValuePosition = function()
{
	return this.m_valuePosition;
};
oFF.XCurrencyFormatSettings.prototype.merge = function(currencyFormatSettings)
{
	if (oFF.notNull(currencyFormatSettings))
	{
		if (currencyFormatSettings.scaleTextSpaceSettingExplicit())
		{
			this.setScaleTextHasSpace(currencyFormatSettings.scaleTextHasSpace());
		}
		if (currencyFormatSettings.currencyPresentationSpaceSettingExplicit())
		{
			this.setCurrencyPresentationHasSpace(currencyFormatSettings.currencyPresentationHasSpace());
		}
		let newPosition = currencyFormatSettings.getCurrencyPresentationPosition();
		if (newPosition > -1)
		{
			this.m_currencyPresentationPosition = newPosition;
		}
		newPosition = currencyFormatSettings.getValuePosition();
		if (newPosition > -1)
		{
			this.m_valuePosition = newPosition;
		}
		newPosition = currencyFormatSettings.getScaleTextPosition();
		if (newPosition > -1)
		{
			this.m_scaleTextPosition = newPosition;
		}
		if (currencyFormatSettings.getCurrencyPresentation() !== null)
		{
			this.m_currencyPresentation = currencyFormatSettings.getCurrencyPresentation();
		}
	}
};
oFF.XCurrencyFormatSettings.prototype.scaleTextHasSpace = function()
{
	return oFF.TriStateBool.getBooleanWithFallback(this.m_scaleTextHasSpace, false);
};
oFF.XCurrencyFormatSettings.prototype.scaleTextSpaceSettingExplicit = function()
{
	return oFF.TriStateBool.isExplicitBooleanValue(this.m_scaleTextHasSpace);
};
oFF.XCurrencyFormatSettings.prototype.setCurrencyPresentation = function(currencyPresentation)
{
	this.m_currencyPresentation = currencyPresentation;
};
oFF.XCurrencyFormatSettings.prototype.setCurrencyPresentationHasSpace = function(currencyPresentationHasSpace)
{
	this.m_currencyPresentationHasSpace = oFF.TriStateBool.lookup(currencyPresentationHasSpace);
};
oFF.XCurrencyFormatSettings.prototype.setCurrencyPresentationPosition = function(currencyPresentationPosition)
{
	this.m_currencyPresentationPosition = currencyPresentationPosition;
};
oFF.XCurrencyFormatSettings.prototype.setScaleTextHasSpace = function(scaleTextHasSpace)
{
	this.m_scaleTextHasSpace = oFF.TriStateBool.lookup(scaleTextHasSpace);
};
oFF.XCurrencyFormatSettings.prototype.setScaleTextPosition = function(scaleTextPosition)
{
	this.m_scaleTextPosition = scaleTextPosition;
};
oFF.XCurrencyFormatSettings.prototype.setValuePosition = function(valuePosition)
{
	this.m_valuePosition = valuePosition;
};

oFF.XNumberFormatterSettings = function() {};
oFF.XNumberFormatterSettings.prototype = new oFF.XObject();
oFF.XNumberFormatterSettings.prototype._ff_c = "XNumberFormatterSettings";

oFF.XNumberFormatterSettings.create = function()
{
	let instance = new oFF.XNumberFormatterSettings();
	instance.m_currencyFormatSettings = oFF.XCurrencyFormatSettings.create();
	return instance;
};
oFF.XNumberFormatterSettings.prototype.m_currencyFormatSettings = null;
oFF.XNumberFormatterSettings.prototype.m_decimalGroupingSeparator = null;
oFF.XNumberFormatterSettings.prototype.m_decimalSeparator = null;
oFF.XNumberFormatterSettings.prototype.m_leftPad = -1;
oFF.XNumberFormatterSettings.prototype.m_maxDigitsRight = -1;
oFF.XNumberFormatterSettings.prototype.m_prefix = -1;
oFF.XNumberFormatterSettings.prototype.m_rightPad = -1;
oFF.XNumberFormatterSettings.prototype.m_scaleFactor = null;
oFF.XNumberFormatterSettings.prototype.m_scaleFormat = null;
oFF.XNumberFormatterSettings.prototype.m_signPresentation = null;
oFF.XNumberFormatterSettings.prototype.getCurrencyFormatSettings = function()
{
	return this.m_currencyFormatSettings;
};
oFF.XNumberFormatterSettings.prototype.getDecimalGroupingSeparator = function()
{
	return this.m_decimalGroupingSeparator;
};
oFF.XNumberFormatterSettings.prototype.getDecimalSeparator = function()
{
	return this.m_decimalSeparator;
};
oFF.XNumberFormatterSettings.prototype.getLeftPad = function()
{
	return this.m_leftPad;
};
oFF.XNumberFormatterSettings.prototype.getMaxDigitsRight = function()
{
	return this.m_maxDigitsRight;
};
oFF.XNumberFormatterSettings.prototype.getPrefix = function()
{
	return this.m_prefix;
};
oFF.XNumberFormatterSettings.prototype.getRightPad = function()
{
	return this.m_rightPad;
};
oFF.XNumberFormatterSettings.prototype.getScale = function()
{
	if (oFF.isNull(this.m_scaleFactor))
	{
		return 1;
	}
	return oFF.XDouble.convertToLong(oFF.XMath.pow(10, this.m_scaleFactor.getInteger()));
};
oFF.XNumberFormatterSettings.prototype.getScaleFactor = function()
{
	return this.m_scaleFactor;
};
oFF.XNumberFormatterSettings.prototype.getScaleFormat = function()
{
	return this.m_scaleFormat;
};
oFF.XNumberFormatterSettings.prototype.getSignPresentation = function()
{
	return this.m_signPresentation;
};
oFF.XNumberFormatterSettings.prototype.setCurrencyFormatSettings = function(currencyFormatSettings)
{
	this.m_currencyFormatSettings.merge(currencyFormatSettings);
};
oFF.XNumberFormatterSettings.prototype.setDecimalGroupingSeparator = function(groupingSeparator)
{
	this.m_decimalGroupingSeparator = groupingSeparator;
};
oFF.XNumberFormatterSettings.prototype.setDecimalSeparator = function(decimalSeparator)
{
	this.m_decimalSeparator = decimalSeparator;
};
oFF.XNumberFormatterSettings.prototype.setLeftPad = function(leftPad)
{
	this.m_leftPad = leftPad;
};
oFF.XNumberFormatterSettings.prototype.setMaxDigitsRight = function(maxDigitsRight)
{
	this.m_maxDigitsRight = maxDigitsRight;
};
oFF.XNumberFormatterSettings.prototype.setPrefix = function(prefix)
{
	this.m_prefix = prefix;
};
oFF.XNumberFormatterSettings.prototype.setRightPad = function(rightPad)
{
	this.m_rightPad = rightPad;
};
oFF.XNumberFormatterSettings.prototype.setScale = function(scale)
{
	if (scale === 1)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(0);
	}
	else if (scale === 10)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(1);
	}
	else if (scale === 100)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(2);
	}
	else if (scale === 1000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(3);
	}
	else if (scale === 10000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(4);
	}
	else if (scale === 100000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(5);
	}
	else if (scale === 1000000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(6);
	}
	else if (scale === 10000000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(7);
	}
	else if (scale === 100000000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(8);
	}
	else if (scale === 1000000000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(9);
	}
	else if (scale === 10000000000)
	{
		this.m_scaleFactor = oFF.XIntegerValue.create(10);
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Illegal scale", oFF.XLongValue.create(scale).getStringRepresentation()));
	}
};
oFF.XNumberFormatterSettings.prototype.setScaleFactor = function(scaleFactor)
{
	this.m_scaleFactor = scaleFactor;
};
oFF.XNumberFormatterSettings.prototype.setScaleFormat = function(scaleFormat)
{
	this.m_scaleFormat = scaleFormat;
};
oFF.XNumberFormatterSettings.prototype.setSignPresentation = function(signPresentation)
{
	this.m_signPresentation = signPresentation;
};

oFF.ProfileNode = function() {};
oFF.ProfileNode.prototype = new oFF.XObject();
oFF.ProfileNode.prototype._ff_c = "ProfileNode";

oFF.ProfileNode.create = function(text, pointInTime)
{
	let newObject = new oFF.ProfileNode();
	newObject.m_text = text;
	newObject.m_start = pointInTime;
	return newObject;
};
oFF.ProfileNode.createWithDuration = function(text, duration)
{
	let newObject = new oFF.ProfileNode();
	newObject.m_text = text;
	newObject.m_duration = duration;
	return newObject;
};
oFF.ProfileNode.renderNode = function(buffer, node, indent, step)
{
	for (let i = 0; i < indent; i++)
	{
		buffer.append("|  ");
	}
	buffer.append("#").appendInt(step).append(": ");
	let text = node.getProfileNodeText();
	if (oFF.isNull(text))
	{
		buffer.append("Node");
	}
	else
	{
		buffer.append(node.getProfileNodeText());
	}
	buffer.append(" ").appendLong(node.getDuration()).append("ms");
	let profileSteps = node.getProfileSteps();
	if (oFF.notNull(profileSteps))
	{
		for (let j = 0; j < profileSteps.size(); j++)
		{
			buffer.appendNewLine();
			oFF.ProfileNode.renderNode(buffer, profileSteps.get(j), indent + 1, j);
		}
	}
};
oFF.ProfileNode.prototype.m_duration = 0;
oFF.ProfileNode.prototype.m_end = 0;
oFF.ProfileNode.prototype.m_hasParent = false;
oFF.ProfileNode.prototype.m_lastOpenStep = null;
oFF.ProfileNode.prototype.m_start = 0;
oFF.ProfileNode.prototype.m_steps = null;
oFF.ProfileNode.prototype.m_text = null;
oFF.ProfileNode.prototype.addNode = function(node)
{
	let pn = node;
	pn.m_hasParent = true;
	this.m_steps.add(pn);
};
oFF.ProfileNode.prototype.addProfileNode = function(node)
{
	if (!node.hasProfileParent())
	{
		let pointInTime = node.getProfilingStart();
		if (oFF.isNull(this.m_steps))
		{
			this.m_steps = oFF.XList.create();
			if (pointInTime !== 0)
			{
				if (this.m_start === 0)
				{
					this.m_start = pointInTime;
				}
				else
				{
					this.m_lastOpenStep = oFF.ProfileNode.create("callWarmup", this.m_start);
					this.addNode(this.m_lastOpenStep);
				}
			}
		}
		if (pointInTime !== 0)
		{
			this.configureLast(pointInTime);
		}
		this.addNode(node);
		this.m_lastOpenStep = null;
	}
};
oFF.ProfileNode.prototype.addProfileStep = function(text)
{
	let pointInTime = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	if (oFF.isNull(this.m_steps))
	{
		this.m_steps = oFF.XList.create();
		if (this.m_start === 0)
		{
			this.m_start = pointInTime;
		}
		else
		{
			this.m_lastOpenStep = oFF.ProfileNode.create("callWarmup", this.m_start);
			this.addNode(this.m_lastOpenStep);
		}
	}
	this.configureLast(pointInTime);
	let newNode = oFF.ProfileNode.create(text, pointInTime);
	this.addNode(newNode);
	this.m_lastOpenStep = newNode;
};
oFF.ProfileNode.prototype.cloneExt = function(flags)
{
	let profileNode = oFF.ProfileNode.create(this.m_text, this.m_start);
	profileNode.m_end = this.m_end;
	profileNode.m_duration = this.m_duration;
	profileNode.m_hasParent = this.m_hasParent;
	if (oFF.notNull(this.m_lastOpenStep))
	{
		profileNode.m_lastOpenStep = this.m_lastOpenStep.clone();
	}
	if (oFF.notNull(this.m_steps))
	{
		profileNode.m_steps = oFF.XCollectionUtils.createListOfClones(this.m_steps);
	}
	return profileNode;
};
oFF.ProfileNode.prototype.configureLast = function(pointInTime)
{
	if (oFF.notNull(this.m_lastOpenStep))
	{
		this.m_lastOpenStep.setProfilingEnd(pointInTime);
	}
	else if (oFF.notNull(this.m_steps))
	{
		let size = this.m_steps.size();
		if (size > 0)
		{
			let lastNode = this.m_steps.get(size - 1);
			let lastEnding = lastNode.getProfilingEnd();
			let delta = pointInTime - lastEnding;
			if (delta > 0)
			{
				let deltaNode = oFF.ProfileNode.create("delta", lastEnding);
				deltaNode.setProfilingEnd(pointInTime);
				this.addNode(deltaNode);
			}
		}
	}
};
oFF.ProfileNode.prototype.detailProfileNode = function(name, detailNode, nameOfRest)
{
	let foundNode = this.searchRecursive(name, this);
	if (oFF.notNull(foundNode))
	{
		if (oFF.isNull(foundNode.m_steps))
		{
			foundNode.m_steps = oFF.XList.create();
		}
		else
		{
			foundNode.m_steps.clear();
		}
		foundNode.addNode(detailNode);
		let roundtripTime = foundNode.getDuration();
		let delta = roundtripTime - detailNode.getDuration();
		let networkNode = oFF.ProfileNode.createWithDuration(nameOfRest, delta);
		foundNode.addNode(networkNode);
	}
};
oFF.ProfileNode.prototype.endProfileStep = function()
{
	let end = this.setProfilingEnd(oFF.XSystemUtils.getCurrentTimeInMilliseconds());
	this.configureLast(end);
};
oFF.ProfileNode.prototype.getDuration = function()
{
	if (this.m_start === 0)
	{
		return this.m_duration;
	}
	if (this.m_end === 0)
	{
		return -2;
	}
	return this.m_end - this.m_start;
};
oFF.ProfileNode.prototype.getProfileNodeText = function()
{
	return this.m_text;
};
oFF.ProfileNode.prototype.getProfileSteps = function()
{
	return this.m_steps;
};
oFF.ProfileNode.prototype.getProfilingEnd = function()
{
	return this.m_end;
};
oFF.ProfileNode.prototype.getProfilingStart = function()
{
	return this.m_start;
};
oFF.ProfileNode.prototype.hasProfileParent = function()
{
	return this.m_hasParent;
};
oFF.ProfileNode.prototype.releaseObject = function()
{
	this.m_lastOpenStep = oFF.XObjectExt.release(this.m_lastOpenStep);
	this.m_steps = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_steps);
	this.m_text = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ProfileNode.prototype.renameLastProfileStep = function(text)
{
	if (oFF.XCollectionUtils.hasElements(this.m_steps))
	{
		let lastNode = this.m_steps.get(this.m_steps.size() - 1);
		lastNode.m_text = text;
	}
};
oFF.ProfileNode.prototype.searchRecursive = function(text, node)
{
	let profileSteps = node.getProfileSteps();
	if (oFF.notNull(profileSteps))
	{
		let size = profileSteps.size();
		for (let i = 0; i < size; i++)
		{
			let foundNode = this.searchRecursive(text, profileSteps.get(i));
			if (oFF.notNull(foundNode))
			{
				return foundNode;
			}
		}
	}
	else if (oFF.XString.isEqual(text, node.getProfileNodeText()))
	{
		return node;
	}
	return null;
};
oFF.ProfileNode.prototype.setProfilingEnd = function(end)
{
	this.m_end = end;
	return this.m_end;
};
oFF.ProfileNode.prototype.toString = function()
{
	let buffer = oFF.XStringBuffer.create();
	oFF.ProfileNode.renderNode(buffer, this, 0, 0);
	return buffer.toString();
};

oFF.XStringBufferExt = function() {};
oFF.XStringBufferExt.prototype = new oFF.XObject();
oFF.XStringBufferExt.prototype._ff_c = "XStringBufferExt";

oFF.XStringBufferExt.create = function()
{
	let buffer = new oFF.XStringBufferExt();
	buffer.setup();
	return buffer;
};
oFF.XStringBufferExt.prototype.m_buffer = null;
oFF.XStringBufferExt.prototype.m_indent = 0;
oFF.XStringBufferExt.prototype.m_indentString = null;
oFF.XStringBufferExt.prototype.m_isNewLine = false;
oFF.XStringBufferExt.prototype.append = function(value)
{
	if (this.m_isNewLine)
	{
		this.setupNewLine();
	}
	this.m_buffer.append(value);
	return this;
};
oFF.XStringBufferExt.prototype.appendBoolean = function(value)
{
	if (this.m_isNewLine)
	{
		this.setupNewLine();
	}
	this.m_buffer.appendBoolean(value);
	return this;
};
oFF.XStringBufferExt.prototype.appendChar = function(value)
{
	if (this.m_isNewLine)
	{
		this.setupNewLine();
	}
	this.m_buffer.appendChar(value);
	return this;
};
oFF.XStringBufferExt.prototype.appendDouble = function(value)
{
	if (this.m_isNewLine)
	{
		this.setupNewLine();
	}
	this.m_buffer.appendDouble(value);
	return this;
};
oFF.XStringBufferExt.prototype.appendInt = function(value)
{
	if (this.m_isNewLine)
	{
		this.setupNewLine();
	}
	this.m_buffer.appendInt(value);
	return this;
};
oFF.XStringBufferExt.prototype.appendLine = function(value)
{
	this.append(value);
	this.appendNewLine();
	return this;
};
oFF.XStringBufferExt.prototype.appendLong = function(value)
{
	if (this.m_isNewLine)
	{
		this.setupNewLine();
	}
	this.m_buffer.appendLong(value);
	return this;
};
oFF.XStringBufferExt.prototype.appendNewLine = function()
{
	this.m_buffer.appendNewLine();
	this.m_isNewLine = true;
	return this;
};
oFF.XStringBufferExt.prototype.appendObject = function(value)
{
	if (oFF.notNull(value))
	{
		this.append(value.toString());
	}
	else
	{
		this.append("null");
	}
	return this;
};
oFF.XStringBufferExt.prototype.clear = function()
{
	this.m_buffer.clear();
};
oFF.XStringBufferExt.prototype.flush = function() {};
oFF.XStringBufferExt.prototype.getIndentation = function()
{
	return this.m_indent;
};
oFF.XStringBufferExt.prototype.getIndentationString = function()
{
	return this.m_indentString;
};
oFF.XStringBufferExt.prototype.indent = function()
{
	this.m_indent++;
	return this;
};
oFF.XStringBufferExt.prototype.length = function()
{
	return this.m_buffer.length();
};
oFF.XStringBufferExt.prototype.outdent = function()
{
	this.m_indent--;
	return this;
};
oFF.XStringBufferExt.prototype.releaseObject = function()
{
	this.m_buffer = oFF.XObjectExt.release(this.m_buffer);
	this.m_indentString = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XStringBufferExt.prototype.setIndentationString = function(indentationString)
{
	this.m_indentString = indentationString;
	return this;
};
oFF.XStringBufferExt.prototype.setup = function()
{
	this.m_buffer = oFF.XStringBuffer.create();
	this.m_indent = 0;
	this.m_indentString = " ";
	this.m_isNewLine = true;
};
oFF.XStringBufferExt.prototype.setupNewLine = function()
{
	for (let i = 0; i < this.m_indent; i++)
	{
		this.m_buffer.append(this.m_indentString);
	}
	this.m_isNewLine = false;
};
oFF.XStringBufferExt.prototype.toString = function()
{
	return this.m_buffer.toString();
};

oFF.XStringBufferJson = function() {};
oFF.XStringBufferJson.prototype = new oFF.XObject();
oFF.XStringBufferJson.prototype._ff_c = "XStringBufferJson";

oFF.XStringBufferJson.create = function()
{
	let buffer = new oFF.XStringBufferJson();
	buffer.setup();
	return buffer;
};
oFF.XStringBufferJson.prototype.m_buffer = null;
oFF.XStringBufferJson.prototype.m_isFirstElement = false;
oFF.XStringBufferJson.prototype.append = function(value)
{
	this.m_buffer.append("\"").append(value).append("\"");
	return this;
};
oFF.XStringBufferJson.prototype.appendBoolean = function(value)
{
	this.m_buffer.appendBoolean(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendChar = function(value)
{
	this.m_buffer.append("\"").appendChar(value).append("\"");
	return this;
};
oFF.XStringBufferJson.prototype.appendDouble = function(value)
{
	this.m_buffer.appendDouble(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendInt = function(value)
{
	this.m_buffer.appendInt(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendLabel = function(label)
{
	if (!this.m_isFirstElement)
	{
		this.m_buffer.append(",");
		this.appendNewLine();
	}
	this.m_buffer.append("\"").append(label).append("\":");
	this.m_isFirstElement = false;
	return this;
};
oFF.XStringBufferJson.prototype.appendLabelAndBoolean = function(label, value)
{
	this.appendLabel(label).appendBoolean(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendLabelAndDouble = function(label, value)
{
	this.appendLabel(label).appendDouble(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendLabelAndInt = function(label, value)
{
	this.appendLabel(label).appendInt(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendLabelAndLong = function(label, value)
{
	this.appendLabel(label).appendLong(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendLabelAndString = function(label, value)
{
	this.appendLabel(label).append(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendLine = function(value)
{
	this.append(value);
	this.appendNewLine();
	return this;
};
oFF.XStringBufferJson.prototype.appendLong = function(value)
{
	this.m_buffer.appendLong(value);
	return this;
};
oFF.XStringBufferJson.prototype.appendNewLine = function()
{
	this.m_buffer.appendNewLine();
	return this;
};
oFF.XStringBufferJson.prototype.appendObject = function(value)
{
	if (oFF.isNull(value))
	{
		this.append("null");
	}
	else
	{
		this.append(value.toString());
	}
	return this;
};
oFF.XStringBufferJson.prototype.appendString = function(label)
{
	if (!this.m_isFirstElement)
	{
		this.m_buffer.append(",");
		this.appendNewLine();
	}
	this.m_buffer.append("\"").append(label).append("\"");
	this.m_isFirstElement = false;
	return this;
};
oFF.XStringBufferJson.prototype.clear = function()
{
	this.m_buffer.clear();
	this.m_isFirstElement = true;
};
oFF.XStringBufferJson.prototype.close = function(bracket)
{
	this.appendNewLine();
	this.m_buffer.outdent();
	this.m_buffer.append(bracket);
	this.m_isFirstElement = false;
	return this;
};
oFF.XStringBufferJson.prototype.closeArray = function()
{
	return this.close("]");
};
oFF.XStringBufferJson.prototype.closeStructure = function()
{
	return this.close("}");
};
oFF.XStringBufferJson.prototype.flush = function() {};
oFF.XStringBufferJson.prototype.length = function()
{
	return this.m_buffer.length();
};
oFF.XStringBufferJson.prototype.open = function(bracket)
{
	if (!this.m_isFirstElement)
	{
		this.appendNewLine();
	}
	this.m_buffer.append(bracket);
	this.appendNewLine();
	this.m_buffer.indent();
	this.m_isFirstElement = true;
	return this;
};
oFF.XStringBufferJson.prototype.openArray = function()
{
	return this.open("[");
};
oFF.XStringBufferJson.prototype.openArrayWithLabel = function(label)
{
	this.appendLabel(label);
	return this.open("[");
};
oFF.XStringBufferJson.prototype.openStructure = function()
{
	if (!this.m_isFirstElement)
	{
		this.m_buffer.append(",");
	}
	return this.open("{");
};
oFF.XStringBufferJson.prototype.openStructureWithLabel = function(label)
{
	this.appendLabel(label);
	return this.open("{");
};
oFF.XStringBufferJson.prototype.releaseObject = function()
{
	this.m_buffer = oFF.XObjectExt.release(this.m_buffer);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XStringBufferJson.prototype.setup = function()
{
	this.m_buffer = oFF.XStringBufferExt.create();
	this.m_buffer.setIndentationString("    ");
	this.m_isFirstElement = true;
};
oFF.XStringBufferJson.prototype.toString = function()
{
	return this.m_buffer.toString();
};

oFF.XCalendar = function() {};
oFF.XCalendar.prototype = new oFF.XObject();
oFF.XCalendar.prototype._ff_c = "XCalendar";

oFF.XCalendar.BASE_YEAR = 1970;
oFF.XCalendar.EPOCH_OFFSET = 719163;
oFF.XCalendar.TIMESTAMP_INVALID = -2;
oFF.XCalendar.TIMESTAMP_MAXIMUM = 2147483647;
oFF.XCalendar.TIMESTAMP_MINIMUM = 0;
oFF.XCalendar.TIMESTAMP_OVERRIDE = -1;
oFF.XCalendar.YEAR_1000 = -30609792000000;
oFF.XCalendar.getDayOfWeekFromFixedDate = function(fixedDate)
{
	if (fixedDate >= 0)
	{
		return oFF.XLong.convertToInt(oFF.XMath.longMod(fixedDate, 7) + oFF.DateConstants.SUNDAY);
	}
	return oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longModFloor(fixedDate, 7));
};
oFF.XCalendar.isGregorianLeapYear = function(gregorianYear)
{
	return (oFF.XMath.mod(gregorianYear, 4) === 0 && oFF.XMath.mod(gregorianYear, 100) !== 0) || oFF.XMath.mod(gregorianYear, 400) === 0;
};
oFF.XCalendar.prototype.m_areFieldsSet = false;
oFF.XCalendar.prototype.m_fields = null;
oFF.XCalendar.prototype.m_firstDayOfWeek = 0;
oFF.XCalendar.prototype.m_isLenient = false;
oFF.XCalendar.prototype.m_isSet = null;
oFF.XCalendar.prototype.m_isTimeSet = false;
oFF.XCalendar.prototype.m_minimalDaysInFirstWeek = 0;
oFF.XCalendar.prototype.m_nextTimestamp = 0;
oFF.XCalendar.prototype.m_time = 0;
oFF.XCalendar.prototype.m_timeZone = null;
oFF.XCalendar.prototype.m_timestamp = null;
oFF.XCalendar.prototype.checkFields = function()
{
	for (let i = 0; i < this.m_fields.size(); i++)
	{
		if (this.m_isSet.get(i).getBoolean())
		{
			let value = this.internalGet(i);
			let min = this.getMinimum(i);
			let max = this.getMaximum(i);
			if (value < min || value > max)
			{
				throw oFF.XException.createIllegalArgumentException("");
			}
		}
	}
};
oFF.XCalendar.prototype.clear = function()
{
	for (let i = 0; i < this.m_fields.size(); i++)
	{
		this.clearField(i);
	}
};
oFF.XCalendar.prototype.clearField = function(field)
{
	this.m_fields.set(field, 0);
	this.m_isSet.set(field, oFF.XBooleanValue.create(false));
	this.m_timestamp.set(field, oFF.XCalendar.TIMESTAMP_INVALID);
	this.m_areFieldsSet = false;
	this.m_isTimeSet = false;
};
oFF.XCalendar.prototype.complete = function()
{
	if (!this.m_isTimeSet)
	{
		this.computeTime();
		this.m_isTimeSet = true;
	}
	if (!this.m_areFieldsSet)
	{
		this.computeFields();
		this.m_areFieldsSet = true;
	}
};
oFF.XCalendar.prototype.createIsReadArray = function()
{
	let isRead = oFF.XArray.create(oFF.DateConstants.FIELD_COUNT);
	for (let i = 0; i < isRead.size(); i++)
	{
		isRead.set(i, oFF.XBooleanValue.create(false));
	}
	return isRead;
};
oFF.XCalendar.prototype.get = function(field)
{
	if (field < 0 || field >= oFF.DateConstants.FIELD_COUNT)
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Invalid field: ", field));
	}
	this.complete();
	return this.internalGet(field);
};
oFF.XCalendar.prototype.getActualMaximum = function(field)
{
	let lowMax = this.getLeastMaximum(field);
	let highMax = this.getMaximum(field);
	if (lowMax === highMax)
	{
		return lowMax;
	}
	let tmpCalendar = this.clone();
	tmpCalendar.setLenient(true);
	let actualMax = lowMax;
	for (let i = lowMax; i <= highMax; i++)
	{
		tmpCalendar.setField(field, i);
		if (tmpCalendar.get(field) !== i)
		{
			break;
		}
		actualMax = i;
	}
	return actualMax;
};
oFF.XCalendar.prototype.getActualMinimum = function(field)
{
	let lowMin = this.getMinimum(field);
	let highMin = this.getGreatestMinimum(field);
	if (lowMin === highMin)
	{
		return lowMin;
	}
	let tmpCalendar = this.clone();
	tmpCalendar.setLenient(true);
	let actualMin = highMin;
	for (let i = highMin; i >= lowMin; i--)
	{
		tmpCalendar.setField(field, i);
		if (tmpCalendar.get(field) !== i)
		{
			break;
		}
		actualMin = i;
	}
	return actualMin;
};
oFF.XCalendar.prototype.getCalendarDate = function(millis, calendarDate)
{
	let ms = 0;
	let zoneOffset = 0;
	let saving = 0;
	let days = 0;
	let zi = calendarDate.getZone();
	if (oFF.notNull(zi))
	{
		let offsets = oFF.XArrayOfInt.create(2);
		zoneOffset = zi.getOffset(millis);
		offsets.set(0, zi.getRawOffset());
		offsets.set(1, zoneOffset - offsets.get(0));
		days = oFF.XMath.div(zoneOffset, oFF.DateConstants.DAY_IN_MILLIS);
		ms = oFF.XMath.mod(zoneOffset, oFF.DateConstants.DAY_IN_MILLIS);
		saving = offsets.get(1);
	}
	calendarDate.setZoneOffset(zoneOffset);
	calendarDate.setDaylightSaving(saving);
	days = days + oFF.XLong.convertToInt(oFF.XMath.longDiv(millis, oFF.DateConstants.DAY_IN_MILLIS));
	ms = ms + oFF.XLong.convertToInt(oFF.XMath.longMod(millis, oFF.DateConstants.DAY_IN_MILLIS));
	if (ms > oFF.DateConstants.DAY_IN_MILLIS)
	{
		ms = ms - oFF.DateConstants.DAY_IN_MILLIS;
		days = days + 1;
	}
	else
	{
		while (ms < 0)
		{
			ms = ms + oFF.DateConstants.DAY_IN_MILLIS;
			days = days - 1;
		}
	}
	days = days + oFF.XCalendar.EPOCH_OFFSET;
	this.getCalendarDateFromDateAndFixedDate(calendarDate, days);
	this.setTimeOfDay(calendarDate, ms);
	calendarDate.setLeapYear(this.isLeapYear(calendarDate.getNormalizedYear()));
	calendarDate.setNormalized(true);
	return calendarDate;
};
oFF.XCalendar.prototype.getCalendarDateFromDateAndFixedDate = function(date, fixedDate)
{
	let gdate = date;
	let year;
	let jan1;
	let isLeap;
	if (gdate.hitFixedDate(fixedDate))
	{
		year = gdate.getCachedYear();
		jan1 = gdate.getCachedJan1();
		isLeap = this.isLeapYear(year);
	}
	else
	{
		year = this.getGregorianYearFromFixedDate(fixedDate);
		jan1 = this.getFixedDate(year, oFF.DateConstants.JANUARY, 1, null);
		isLeap = this.isLeapYear(year);
		gdate.setCache(year, jan1, isLeap ? 366 : 365);
	}
	let priorDays = oFF.XLong.convertToInt(fixedDate - jan1);
	let mar1 = jan1 + 31 + 28;
	if (isLeap)
	{
		mar1 = mar1 + 1;
	}
	if (fixedDate >= mar1)
	{
		priorDays = priorDays + (isLeap ? 1 : 2);
	}
	let month = 12 * priorDays + 373;
	if (month > 0)
	{
		month = oFF.XMath.div(month, 367);
	}
	else
	{
		month = oFF.XAbstractCalendarDate.floorDivide(month, 367);
	}
	let month1 = jan1 + oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.get(month);
	if (isLeap && month >= oFF.DateConstants.MARCH)
	{
		month1 = month1 + 1;
	}
	let dayOfMonth = oFF.XLong.convertToInt((fixedDate - month1) + 1);
	let dayOfWeek = oFF.XCalendar.getDayOfWeekFromFixedDate(fixedDate);
	oFF.XObjectExt.assertTrueExt(dayOfWeek > 0, "Negative day of week");
	gdate.setNormalizedYear(year);
	gdate.setMonth(month);
	gdate.setDayOfMonth(dayOfMonth);
	gdate.setDayOfWeek(dayOfWeek);
	gdate.setLeapYear(isLeap);
	gdate.setNormalized(true);
};
oFF.XCalendar.prototype.getDayOfWeekWithdate = function(date)
{
	let fixedDate = this.getFixedDateWithDate(date);
	return oFF.XCalendar.getDayOfWeekFromFixedDate(fixedDate);
};
oFF.XCalendar.prototype.getDayOfYearAsLong = function(year, month, dayOfMonth)
{
	return dayOfMonth + (this.isLeapYear(year) ? oFF.DateConstants.DAYS_IN_LEAP_YEAR.get(month) : oFF.DateConstants.DAYS_IN_COMMON_YEAR.get(month));
};
oFF.XCalendar.prototype.getDayOfYearForDateAsLong = function(date)
{
	return this.getDayOfYearAsLong(date.getNormalizedYear(), date.getMonth(), date.getDayOfMonth());
};
oFF.XCalendar.prototype.getFirstDayOfWeek = function()
{
	return this.m_firstDayOfWeek;
};
oFF.XCalendar.prototype.getFixedDate = function(year, month, dayOfMonth, cache)
{
	let isJan1 = month === oFF.DateConstants.JANUARY && dayOfMonth === 1;
	if (oFF.notNull(cache) && cache.hit(year))
	{
		if (isJan1)
		{
			return cache.getCachedJan1();
		}
		return cache.getCachedJan1() + this.getDayOfYearAsLong(year, month, dayOfMonth) - 1;
	}
	let n = year - oFF.XCalendar.BASE_YEAR;
	if (n >= 0 && n < oFF.DateConstants.FIXED_DATES.size())
	{
		let jan1 = oFF.DateConstants.FIXED_DATES.get(n);
		if (oFF.notNull(cache))
		{
			cache.setCache(year, jan1, this.isLeapYear(year) ? 366 : 365);
		}
		return isJan1 ? jan1 : jan1 + this.getDayOfYearAsLong(year, month, dayOfMonth) - 1;
	}
	let prevyear = year - 1;
	let days = dayOfMonth;
	if (prevyear >= 0)
	{
		days = days + (365 * prevyear) + oFF.XMath.longDiv(prevyear, 4) - oFF.XMath.longDiv(prevyear, 100) + oFF.XMath.longDiv(prevyear, 400) + oFF.XMath.longDiv(367 * month - 362, 12);
	}
	else
	{
		days = days + (365 + prevyear) + oFF.XAbstractCalendarDate.longFloorDivide(prevyear, 4) - oFF.XAbstractCalendarDate.longFloorDivide(prevyear, 100) + oFF.XAbstractCalendarDate.longFloorDivide(prevyear, 400) + oFF.XAbstractCalendarDate.longFloorDivide(367 * month - 362, 12);
	}
	if (month > oFF.DateConstants.FEBRUARY)
	{
		days = days - (this.isLeapYear(year) ? 1 : 2);
	}
	if (oFF.notNull(cache) && isJan1)
	{
		cache.setCache(year, days, this.isLeapYear(year) ? 366 : 365);
	}
	return days;
};
oFF.XCalendar.prototype.getFixedDateWithDate = function(date)
{
	if (!date.isNormalized())
	{
		this.normalizeMonth(date);
	}
	return this.getFixedDate(date.getNormalizedYear(), date.getMonth(), date.getDayOfMonth(), date);
};
oFF.XCalendar.prototype.getGregorianYearFromFixedDate = function(fixedDate)
{
	let d0;
	let d1;
	let d2;
	let d3;
	let n400;
	let n100;
	let n4;
	let n1;
	let year;
	if (fixedDate > 0)
	{
		d0 = fixedDate - 1;
		n400 = oFF.XLong.convertToInt(oFF.XMath.longDiv(d0, 146097));
		d1 = oFF.XLong.convertToInt(oFF.XMath.longMod(d0, 146097));
		n100 = oFF.XMath.div(d1, 36524);
		d2 = oFF.XMath.mod(d1, 36524);
		n4 = oFF.XMath.div(d2, 1461);
		d3 = oFF.XMath.mod(d2, 1461);
		n1 = oFF.XMath.div(d3, 365);
	}
	else
	{
		d0 = fixedDate - 1;
		n400 = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longFloorDivide(d0, 146097));
		d1 = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longModFloor(d0, 146097));
		n100 = oFF.XAbstractCalendarDate.floorDivide(d1, 36524);
		d2 = oFF.XAbstractCalendarDate.modFloor(d1, 36524);
		n4 = oFF.XAbstractCalendarDate.floorDivide(d2, 1461);
		d3 = oFF.XAbstractCalendarDate.modFloor(d2, 1461);
		n1 = oFF.XAbstractCalendarDate.floorDivide(d3, 365);
	}
	year = 400 * n400 + 100 * n100 + 4 * n4 + n1;
	if (!(n100 === 4 || n1 === 4))
	{
		year = year + 1;
	}
	return year;
};
oFF.XCalendar.prototype.getMinimalDaysInFirstWeek = function()
{
	return this.m_minimalDaysInFirstWeek;
};
oFF.XCalendar.prototype.getTime = function(date)
{
	let gd = this.getFixedDateWithDate(date);
	let ms = (gd - oFF.XCalendar.EPOCH_OFFSET) * oFF.DateConstants.DAY_IN_MILLIS + this.getTimeOfDay(date);
	let zoneOffset = 0;
	let timeZone = date.getZone();
	if (oFF.notNull(timeZone))
	{
		if (date.isNormalized())
		{
			return ms - date.getZoneOffset();
		}
		zoneOffset = timeZone.getOffset(ms - timeZone.getRawOffset());
	}
	ms = ms - zoneOffset;
	this.getCalendarDate(ms, date);
	return ms;
};
oFF.XCalendar.prototype.getTimeInMillis = function()
{
	if (!this.m_isTimeSet)
	{
		this.computeTime();
		this.m_isTimeSet = true;
	}
	return this.m_time;
};
oFF.XCalendar.prototype.getTimeOfDay = function(date)
{
	let fraction = date.getTimeOfDay();
	if (fraction !== oFF.DateConstants.TIME_UNDEFINED)
	{
		return fraction;
	}
	fraction = this.getTimeOfDayValue(date);
	date.setTimeOfDayWithFraction(fraction);
	return fraction;
};
oFF.XCalendar.prototype.getTimeOfDayValue = function(date)
{
	let fraction = date.getHours();
	fraction = fraction * 60;
	fraction = fraction + date.getMinutes();
	fraction = fraction * 60;
	fraction = fraction + date.getSeconds();
	fraction = fraction * 1000;
	fraction = fraction + date.getMillis();
	return fraction;
};
oFF.XCalendar.prototype.getTimeZone = function()
{
	return this.m_timeZone;
};
oFF.XCalendar.prototype.getTimestamp = function()
{
	let timestamp = this.m_nextTimestamp;
	if (timestamp !== oFF.XCalendar.TIMESTAMP_MAXIMUM)
	{
		timestamp++;
	}
	else
	{
		let map = oFF.XSimpleMap.create();
		for (let i = 0; i < this.m_fields.size(); i++)
		{
			let tmpTimestamp = this.m_timestamp.get(i);
			if (tmpTimestamp < oFF.XCalendar.TIMESTAMP_MINIMUM)
			{
				continue;
			}
			map.put(oFF.XIntegerValue.create(tmpTimestamp), oFF.XIntegerValue.create(i));
		}
		this.m_nextTimestamp = oFF.XCalendar.TIMESTAMP_MINIMUM;
		let iterator = map.getKeysAsIterator();
		while (iterator.hasNext())
		{
			let tmpTimestampAsKey = iterator.next();
			let field = map.getByKey(tmpTimestampAsKey).getInteger();
			this.m_timestamp.set(field, this.m_nextTimestamp);
			this.m_nextTimestamp++;
		}
	}
	return timestamp;
};
oFF.XCalendar.prototype.internalGet = function(field)
{
	return this.m_fields.get(field);
};
oFF.XCalendar.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let xOther = other;
	let otherTime = xOther.getTimeInMillis();
	if (this.getTimeInMillis() !== otherTime)
	{
		return false;
	}
	if (this.isLenient() !== xOther.isLenient())
	{
		return false;
	}
	if (this.getFirstDayOfWeek() !== xOther.getFirstDayOfWeek())
	{
		return false;
	}
	if (this.getMinimalDaysInFirstWeek() !== xOther.getMinimalDaysInFirstWeek())
	{
		return false;
	}
	if (!this.m_timeZone.isEqualTo(xOther.getTimeZone()))
	{
		return false;
	}
	return true;
};
oFF.XCalendar.prototype.isExternallySet = function(field)
{
	return this.m_timestamp.get(field) !== oFF.XCalendar.TIMESTAMP_INVALID;
};
oFF.XCalendar.prototype.isLenient = function()
{
	return this.m_isLenient;
};
oFF.XCalendar.prototype.normalize = function(calendarDate)
{
	if (calendarDate.isNormalized())
	{
		return true;
	}
	let baseCalendarDate = calendarDate;
	let timeZone = baseCalendarDate.getZone();
	if (oFF.notNull(timeZone))
	{
		this.getTime(calendarDate);
		return true;
	}
	let days = this.normalizeTime(baseCalendarDate);
	this.normalizeMonth(baseCalendarDate);
	let d = baseCalendarDate.getDayOfMonth() + days;
	let m = baseCalendarDate.getMonth();
	let y = baseCalendarDate.getNormalizedYear();
	let ml = this.getDaysInMonth(y, m);
	if (!(d > 0 && d <= ml))
	{
		if (d <= 0 && d > -28)
		{
			ml = this.getDaysInMonth(y, m - 1);
			d = d + ml;
			baseCalendarDate.setDayOfMonth(oFF.XLong.convertToInt(d));
			if (m === 0)
			{
				m = oFF.DateConstants.DECEMBER;
				baseCalendarDate.setNormalizedYear(y - 1);
			}
			baseCalendarDate.setMonth(m);
		}
		else if (d > ml && d < (ml + 28))
		{
			d = d - ml;
			baseCalendarDate.setDayOfMonth(oFF.XLong.convertToInt(d));
			if (m > oFF.DateConstants.DECEMBER)
			{
				baseCalendarDate.setNormalizedYear(y + 1);
				m = oFF.DateConstants.JANUARY;
			}
			baseCalendarDate.setMonth(m);
		}
		else
		{
			let fixedDate = d + this.getFixedDate(y, m, 1, baseCalendarDate) - 1;
			this.getCalendarDateFromDateAndFixedDate(baseCalendarDate, fixedDate);
		}
	}
	else
	{
		baseCalendarDate.setDayOfWeek(this.getDayOfWeekWithdate(baseCalendarDate));
	}
	calendarDate.setLeapYear(this.isLeapYear(baseCalendarDate.getNormalizedYear()));
	calendarDate.setZoneOffset(0);
	calendarDate.setDaylightSaving(0);
	baseCalendarDate.setNormalized(true);
	return true;
};
oFF.XCalendar.prototype.normalizeMonth = function(date)
{
	let baseCalendarDate = date;
	let year = baseCalendarDate.getNormalizedYear();
	let month = baseCalendarDate.getMonth();
	if (month <= 0)
	{
		let xm = 1 - month;
		year = year - oFF.XLong.convertToInt(oFF.XMath.longDiv(xm, 12) + 1);
		month = 13 - (oFF.XMath.longMod(xm, 12));
		if (month === 13)
		{
			year++;
			month = 1;
		}
		baseCalendarDate.setNormalizedYear(year);
		baseCalendarDate.setMonth(oFF.XLong.convertToInt(month));
	}
	else if (month > oFF.DateConstants.DECEMBER)
	{
		year = year + oFF.XLong.convertToInt(oFF.XMath.longDiv(month - 1, 12));
		month = oFF.XLong.convertToInt(oFF.XMath.longMod(month - 1, 13));
		baseCalendarDate.setNormalizedYear(year);
		baseCalendarDate.setMonth(oFF.XLong.convertToInt(month));
	}
};
oFF.XCalendar.prototype.normalizeTime = function(date)
{
	let fraction = this.getTimeOfDay(date);
	let days = 0;
	if (fraction >= oFF.DateConstants.DAY_IN_MILLIS)
	{
		days = oFF.XMath.longDiv(fraction, oFF.DateConstants.DAY_IN_MILLIS);
		fraction = oFF.XMath.longMod(fraction, oFF.DateConstants.DAY_IN_MILLIS);
	}
	else if (fraction < 0)
	{
		days = oFF.XAbstractCalendarDate.longFloorDivide(fraction, oFF.DateConstants.DAY_IN_MILLIS);
		if (days !== 0)
		{
			fraction = fraction - oFF.DateConstants.DAY_IN_MILLIS * days;
		}
	}
	if (days !== 0)
	{
		date.setTimeOfDayWithFraction(fraction);
	}
	let millis = oFF.XLong.convertToInt(oFF.XMath.longMod(fraction, 1000));
	date.setMillis(millis);
	fraction = oFF.XMath.longDiv(fraction, 1000);
	let seconds = oFF.XLong.convertToInt(oFF.XMath.longMod(fraction, 60));
	date.setSeconds(seconds);
	fraction = oFF.XMath.longDiv(fraction, 60);
	let minutes = oFF.XLong.convertToInt(oFF.XMath.longMod(fraction, 60));
	date.setMinutes(minutes);
	let hours = oFF.XLong.convertToInt(oFF.XMath.longDiv(fraction, 60));
	date.setHours(hours);
	let intDays = oFF.XLong.convertToInt(days);
	return intDays;
};
oFF.XCalendar.prototype.releaseObject = function()
{
	this.m_fields = oFF.XObjectExt.release(this.m_fields);
	this.m_isSet = oFF.XObjectExt.release(this.m_isSet);
	this.m_timestamp = oFF.XObjectExt.release(this.m_timestamp);
	this.m_timeZone = oFF.XObjectExt.release(this.m_timeZone);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XCalendar.prototype.set = function(year, month, date)
{
	this.setField(oFF.DateConstants.YEAR, year);
	this.setField(oFF.DateConstants.MONTH, month);
	this.setField(oFF.DateConstants.DATE, date);
};
oFF.XCalendar.prototype.setDateTime = function(dateTime)
{
	this.setTimeInMillis(dateTime.getTimeInMilliseconds());
};
oFF.XCalendar.prototype.setField = function(field, value)
{
	if (field < 0 || field >= oFF.DateConstants.FIELD_COUNT)
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Invalid field: ", field));
	}
	this.m_fields.set(field, value);
	this.m_isSet.set(field, oFF.XBooleanValue.create(true));
	this.m_timestamp.set(field, this.getTimestamp());
	this.m_time = 0;
	this.m_isTimeSet = false;
	this.m_areFieldsSet = false;
};
oFF.XCalendar.prototype.setFirstDayOfWeek = function(firstDayOfWeek)
{
	if (this.m_firstDayOfWeek !== firstDayOfWeek)
	{
		this.m_firstDayOfWeek = firstDayOfWeek;
		this.m_fields.set(oFF.DateConstants.WEEK_OF_MONTH, 0);
		this.m_isSet.set(oFF.DateConstants.WEEK_OF_MONTH, oFF.XBooleanValue.create(false));
		this.m_timestamp.set(oFF.DateConstants.WEEK_OF_MONTH, oFF.XCalendar.TIMESTAMP_INVALID);
		this.m_fields.set(oFF.DateConstants.WEEK_OF_YEAR, 0);
		this.m_isSet.set(oFF.DateConstants.WEEK_OF_YEAR, oFF.XBooleanValue.create(false));
		this.m_timestamp.set(oFF.DateConstants.WEEK_OF_YEAR, oFF.XCalendar.TIMESTAMP_INVALID);
		this.m_areFieldsSet = false;
	}
};
oFF.XCalendar.prototype.setLenient = function(lenient)
{
	this.m_isLenient = lenient;
};
oFF.XCalendar.prototype.setMinimalDaysInFirstWeek = function(minimalDaysInFirstWeek)
{
	if (this.m_minimalDaysInFirstWeek !== minimalDaysInFirstWeek)
	{
		this.m_minimalDaysInFirstWeek = minimalDaysInFirstWeek;
		this.m_fields.set(oFF.DateConstants.WEEK_OF_MONTH, 0);
		this.m_isSet.set(oFF.DateConstants.WEEK_OF_MONTH, oFF.XBooleanValue.create(false));
		this.m_timestamp.set(oFF.DateConstants.WEEK_OF_MONTH, oFF.XCalendar.TIMESTAMP_INVALID);
		this.m_fields.set(oFF.DateConstants.WEEK_OF_YEAR, 0);
		this.m_isSet.set(oFF.DateConstants.WEEK_OF_YEAR, oFF.XBooleanValue.create(false));
		this.m_timestamp.set(oFF.DateConstants.WEEK_OF_YEAR, oFF.XCalendar.TIMESTAMP_INVALID);
		this.m_areFieldsSet = false;
	}
};
oFF.XCalendar.prototype.setTimeInMillis = function(timeInMillis)
{
	let minMillis = oFF.XDateTime.UTC(1582 - 1900, oFF.DateConstants.OCTOBER, 15, 0, 0, 0);
	let maxMillis = oFF.XDateTime.UTC(9999 - 1900, oFF.DateConstants.DECEMBER, 31, 23, 59, 59) + 999;
	if (timeInMillis < minMillis && timeInMillis !== oFF.XCalendar.YEAR_1000)
	{
		oFF.noSupport();
	}
	if (timeInMillis > maxMillis)
	{
		oFF.noSupport();
	}
	this.clear();
	this.m_areFieldsSet = false;
	this.m_time = timeInMillis;
	this.m_isTimeSet = true;
	this.computeFields();
	this.m_areFieldsSet = true;
};
oFF.XCalendar.prototype.setTimeOfDay = function(cDate, fraction)
{
	if (fraction < 0)
	{
		throw oFF.XException.createIllegalArgumentException("Fraction must be larger than 0");
	}
	let normalizedState = cDate.isNormalized();
	let time = fraction;
	let hours = oFF.XMath.div(time, oFF.DateConstants.HOUR_IN_MILLIS);
	time = oFF.XMath.mod(time, oFF.DateConstants.HOUR_IN_MILLIS);
	let minutes = oFF.XMath.div(time, oFF.DateConstants.MINUTE_IN_MILLIS);
	time = oFF.XMath.mod(time, oFF.DateConstants.MINUTE_IN_MILLIS);
	let seconds = oFF.XMath.div(time, oFF.DateConstants.SECOND_IN_MILLIS);
	time = oFF.XMath.mod(time, oFF.DateConstants.SECOND_IN_MILLIS);
	cDate.setHours(hours);
	cDate.setMinutes(minutes);
	cDate.setSeconds(seconds);
	cDate.setMillis(time);
	cDate.setTimeOfDayWithFraction(fraction);
	if (hours < 24 && normalizedState)
	{
		cDate.setNormalized(true);
	}
	return cDate;
};
oFF.XCalendar.prototype.setTimeZone = function(timeZone)
{
	this.m_timeZone = timeZone;
	this.m_areFieldsSet = false;
};

oFF.XTimeZone = function() {};
oFF.XTimeZone.prototype = new oFF.XObject();
oFF.XTimeZone.prototype._ff_c = "XTimeZone";

oFF.XTimeZone.GMT_ID = "GMT";
oFF.XTimeZone.LONG = 1;
oFF.XTimeZone.ONE_DAY = 86400000;
oFF.XTimeZone.ONE_HOUR = 3600000;
oFF.XTimeZone.ONE_MINUTE = 60000;
oFF.XTimeZone.SHORT = 0;
oFF.XTimeZone.getCurrentTimeZoneString = function()
{
	let result = null;
	let offsetMinutes = oFF.XTimeZone.getTimezoneOffsetInMinutes();
	let absOffset = offsetMinutes < 0 ? -offsetMinutes : offsetMinutes;
	let sign = offsetMinutes < 0 ? "-" : "+";
	let hourString = oFF.XStringUtils.addNumberPadded(oFF.XMath.div(absOffset, 60), 2);
	let minutesString = oFF.XStringUtils.addNumberPadded(oFF.XMath.mod(absOffset, 60), 2);
	result = oFF.XStringUtils.concatenate5("GMT", sign, hourString, ":", minutesString);
	return result;
};
oFF.XTimeZone.getTimezoneOffsetInMinutes = function()
{
	return oFF.XSystemUtils.getSystemTimezoneOffsetInMilliseconds() / 60000;
};
oFF.XTimeZone.prototype.m_timeZoneId = null;
oFF.XTimeZone.prototype.getDSTSavings = function()
{
	if (this.useDaylightTime())
	{
		return 3600000;
	}
	return 0;
};
oFF.XTimeZone.prototype.getOffset = function(date)
{
	if (this.inDaylightTime(oFF.XDateTime.createWithMilliseconds(date)))
	{
		return this.getRawOffset() + this.getDSTSavings();
	}
	return this.getRawOffset();
};
oFF.XTimeZone.prototype.getOffsets = function(date, offsets)
{
	let rawOffset = this.getRawOffset();
	let dstoffset = 0;
	if (this.inDaylightTime(oFF.XDateTime.createWithMilliseconds(date)))
	{
		dstoffset = this.getDSTSavings();
	}
	if (oFF.notNull(offsets))
	{
		offsets.set(0, rawOffset);
		offsets.set(1, dstoffset);
	}
	return rawOffset + dstoffset;
};
oFF.XTimeZone.prototype.getTimeZoneId = function()
{
	return this.m_timeZoneId;
};
oFF.XTimeZone.prototype.observeDaylightTime = function()
{
	return this.useDaylightTime() || this.inDaylightTime(oFF.XDateTime.createWithEmptyTimezone());
};
oFF.XTimeZone.prototype.setTimeZoneId = function(timeZoneId)
{
	if (oFF.isNull(timeZoneId))
	{
		throw oFF.XException.createIllegalArgumentException("timeZoneId is null");
	}
	this.m_timeZoneId = timeZoneId;
};

oFF.XGregorianCalendarDate = function() {};
oFF.XGregorianCalendarDate.prototype = new oFF.XBaseCalendarDate();
oFF.XGregorianCalendarDate.prototype._ff_c = "XGregorianCalendarDate";

oFF.XGregorianCalendarDate.createWithTimeZone = function(timeZone)
{
	let instance = new oFF.XGregorianCalendarDate();
	instance.setZone(timeZone);
	return instance;
};
oFF.XGregorianCalendarDate.prototype.getNormalizedYear = function()
{
	return this.getYear();
};
oFF.XGregorianCalendarDate.prototype.setNormalizedYear = function(normalizedYear)
{
	this.setYear(normalizedYear);
};

oFF.XLocalGregorianCalendarDate = function() {};
oFF.XLocalGregorianCalendarDate.prototype = new oFF.XBaseCalendarDate();
oFF.XLocalGregorianCalendarDate.prototype._ff_c = "XLocalGregorianCalendarDate";

oFF.XLocalGregorianCalendarDate.createWithTimeZone = function(timeZone)
{
	let instance = new oFF.XLocalGregorianCalendarDate();
	instance.setZone(timeZone);
	instance.m_gregorianYear = oFF.DateConstants.FIELD_UNDEFINED;
	return instance;
};
oFF.XLocalGregorianCalendarDate.prototype.m_gregorianYear = 0;
oFF.XLocalGregorianCalendarDate.prototype.addYear = function(numYears)
{
	oFF.XBaseCalendarDate.prototype.addYear.call( this , numYears);
	this.m_gregorianYear = this.m_gregorianYear + numYears;
	return this;
};
oFF.XLocalGregorianCalendarDate.prototype.cloneExt = function(flags)
{
	let other = oFF.XLocalGregorianCalendarDate.createWithTimeZone(this.getZone());
	other.setEra(this.getEra());
	other.setDate(this.getYear(), this.getMonth(), this.getDayOfMonth());
	return other;
};
oFF.XLocalGregorianCalendarDate.prototype.getNormalizedYear = function()
{
	return this.m_gregorianYear;
};
oFF.XLocalGregorianCalendarDate.prototype.setEra = function(era)
{
	if (!this.getEra().isEqualTo(era))
	{
		oFF.XBaseCalendarDate.prototype.setEra.call( this , era);
		this.m_gregorianYear = oFF.DateConstants.FIELD_UNDEFINED;
	}
	return this;
};
oFF.XLocalGregorianCalendarDate.prototype.setLocalEra = function(era)
{
	oFF.XBaseCalendarDate.prototype.setEra.call( this , era);
};
oFF.XLocalGregorianCalendarDate.prototype.setLocalYear = function(year)
{
	oFF.XBaseCalendarDate.prototype.setYear.call( this , year);
};
oFF.XLocalGregorianCalendarDate.prototype.setNormalizedYear = function(normalizedYear)
{
	this.m_gregorianYear = normalizedYear;
};
oFF.XLocalGregorianCalendarDate.prototype.setYear = function(year)
{
	if (this.getYear() !== year)
	{
		oFF.XBaseCalendarDate.prototype.setYear.call( this , year);
		this.m_gregorianYear = oFF.DateConstants.FIELD_UNDEFINED;
	}
	return this;
};

oFF.XComponent = function() {};
oFF.XComponent.prototype = new oFF.XObjectExt();
oFF.XComponent.prototype._ff_c = "XComponent";

oFF.XComponent.prototype.m_propertyListeners = null;
oFF.XComponent.prototype.getComponentType = oFF.noSupport;
oFF.XComponent.prototype.getListenerIndex = function(listener, property)
{
	for (let i = 0; i < this.m_propertyListeners.size(); i++)
	{
		let pair = this.m_propertyListeners.get(i);
		let myListener = pair.getListener();
		let myProperty = pair.getProperty();
		if (myListener === listener && oFF.XString.isEqual(myProperty, property))
		{
			return i;
		}
	}
	return -1;
};
oFF.XComponent.prototype.raisePropertyEvent = function(property, value)
{
	let theEvent = oFF.XPropertyEvent.create(this, property, value);
	for (let i = 0; i < this.m_propertyListeners.size(); i++)
	{
		let pair = this.m_propertyListeners.get(i);
		let myProperty = pair.getProperty();
		if (oFF.XString.isEqual(myProperty, property))
		{
			let listener = pair.getListener();
			listener.onPropertyChanged(this, theEvent, pair.getCustomIdentifier());
		}
	}
};
oFF.XComponent.prototype.registerPropertyListener = function(listener, property, customIdentifier)
{
	this.unregisterPropertyListener(listener, property);
	this.m_propertyListeners.add(oFF.XPropertyListenerPair.create(listener, property, customIdentifier));
};
oFF.XComponent.prototype.releaseObject = function()
{
	this.m_propertyListeners = oFF.XObjectExt.release(this.m_propertyListeners);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.XComponent.prototype.setup = function()
{
	this.m_propertyListeners = oFF.XList.create();
};
oFF.XComponent.prototype.unregisterPropertyListener = function(listener, property)
{
	let listenerIndex = this.getListenerIndex(listener, property);
	if (listenerIndex !== -1)
	{
		this.m_propertyListeners.removeAt(listenerIndex);
	}
};

oFF.MessageManagerSimple = function() {};
oFF.MessageManagerSimple.prototype = new oFF.XObjectExt();
oFF.MessageManagerSimple.prototype._ff_c = "MessageManagerSimple";

oFF.MessageManagerSimple.createMessageManager = function()
{
	let object = new oFF.MessageManagerSimple();
	object.setup();
	return object;
};
oFF.MessageManagerSimple.shouldMessageBeAdded = function(message)
{
	if (oFF.notNull(message))
	{
		let messageCode = message.getCode();
		if (messageCode === 42021)
		{
			let severity = message.getSeverity();
			if (severity === oFF.Severity.WARNING)
			{
				return false;
			}
		}
	}
	return true;
};
oFF.MessageManagerSimple.prototype.m_clientStatusCode = 0;
oFF.MessageManagerSimple.prototype.m_messages = null;
oFF.MessageManagerSimple.prototype.m_profileNode = null;
oFF.MessageManagerSimple.prototype.m_serverStatusCode = 0;
oFF.MessageManagerSimple.prototype.m_serverStatusDetails = null;
oFF.MessageManagerSimple.prototype.addAllMessages = function(messages)
{
	if (oFF.notNull(messages))
	{
		this.getOrCreateMessages().addAll(messages.getMessages());
		let rootProfileNode = messages.getRootProfileNode();
		this.addProfileNode(rootProfileNode);
		this.setClientStatusCode(messages.getClientStatusCode());
		this.setServerStatusCode(messages.getServerStatusCode());
		this.setServerStatusDetails(messages.getServerStatusDetails());
	}
};
oFF.MessageManagerSimple.prototype.addError = function(code, message)
{
	return this.addErrorExt(this.getDefaultMessageLayer(), code, message, null);
};
oFF.MessageManagerSimple.prototype.addErrorExt = function(originLayer, code, message, extendedInfo)
{
	return this.addNewMessage(originLayer, oFF.Severity.ERROR, code, message, true, extendedInfo);
};
oFF.MessageManagerSimple.prototype.addErrorWithMessage = function(message)
{
	return this.addErrorExt(this.getDefaultMessageLayer(), oFF.ErrorCodes.OTHER_ERROR, message, null);
};
oFF.MessageManagerSimple.prototype.addInfo = function(code, message)
{
	return this.addInfoExt(this.getDefaultMessageLayer(), code, message);
};
oFF.MessageManagerSimple.prototype.addInfoExt = function(originLayer, code, message)
{
	return this.addNewMessage(originLayer, oFF.Severity.INFO, code, message, true, null);
};
oFF.MessageManagerSimple.prototype.addMessage = function(message)
{
	if (oFF.MessageManagerSimple.shouldMessageBeAdded(message))
	{
		let code = message.getCode();
		if (this.m_clientStatusCode === 0 && code !== 0)
		{
			this.setClientStatusCode(code);
		}
		this.getOrCreateMessages().add(message);
	}
};
oFF.MessageManagerSimple.prototype.addNewMessage = function(originLayer, severity, code, message, withStackTrace, extendedInfo)
{
	let newMessage = oFF.XMessage.createMessage(originLayer, severity, code, message, null, withStackTrace, extendedInfo);
	this.addMessage(newMessage);
	return newMessage;
};
oFF.MessageManagerSimple.prototype.addProfileNode = function(node)
{
	if (oFF.notNull(this.m_profileNode) && oFF.notNull(node) && node.getProfilingStart() !== 0)
	{
		this.m_profileNode.addProfileNode(node);
	}
};
oFF.MessageManagerSimple.prototype.addProfileStep = function(text)
{
	this.m_profileNode.addProfileStep(text);
};
oFF.MessageManagerSimple.prototype.addSemanticalError = function(originLayer, code, message)
{
	return this.addNewMessage(originLayer, oFF.Severity.SEMANTICAL_ERROR, code, message, true, null);
};
oFF.MessageManagerSimple.prototype.addWarning = function(code, message)
{
	return this.addWarningExt(this.getDefaultMessageLayer(), code, message);
};
oFF.MessageManagerSimple.prototype.addWarningExt = function(originLayer, code, message)
{
	return this.addWarningExtWithExtendedInfo(originLayer, code, message, null);
};
oFF.MessageManagerSimple.prototype.addWarningExtWithExtendedInfo = function(originLayer, code, message, extendedInfo)
{
	return this.addNewMessage(originLayer, oFF.Severity.WARNING, code, message, true, extendedInfo);
};
oFF.MessageManagerSimple.prototype.clearMessages = function()
{
	this.getOrCreateMessages().clear();
	this.m_clientStatusCode = 0;
	this.m_serverStatusCode = 0;
	this.m_serverStatusDetails = null;
};
oFF.MessageManagerSimple.prototype.containsCode = function(severity, code)
{
	return oFF.XCollectionUtils.contains(this.getOrCreateMessages(), (message) => {
		return oFF.notNull(message) && message.getCode() === code && message.getSeverity() === severity;
	});
};
oFF.MessageManagerSimple.prototype.copyAllMessages = function(messages)
{
	if (oFF.notNull(messages))
	{
		let messageList = messages.getMessages();
		if (oFF.notNull(messageList))
		{
			oFF.XCollectionUtils.addAllClones(this.getOrCreateMessages(), messageList);
		}
		let rootProfileNode = messages.getRootProfileNode();
		this.addProfileNode(rootProfileNode.clone());
		this.setClientStatusCode(messages.getClientStatusCode());
		this.setServerStatusCode(messages.getServerStatusCode());
		this.setServerStatusDetails(messages.getServerStatusDetails());
	}
};
oFF.MessageManagerSimple.prototype.detailProfileNode = function(name, detailNode, nameOfRest)
{
	this.m_profileNode.detailProfileNode(name, detailNode, nameOfRest);
};
oFF.MessageManagerSimple.prototype.endProfileStep = function()
{
	if (oFF.notNull(this.m_profileNode))
	{
		this.m_profileNode.endProfileStep();
	}
};
oFF.MessageManagerSimple.prototype.getClientStatusCode = function()
{
	return this.m_clientStatusCode;
};
oFF.MessageManagerSimple.prototype.getDefaultMessageLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.MessageManagerSimple.prototype.getDuration = function()
{
	return this.m_profileNode.getDuration();
};
oFF.MessageManagerSimple.prototype.getErrors = function()
{
	return this.getMessagesBySeverity(oFF.Severity.ERROR);
};
oFF.MessageManagerSimple.prototype.getFirstError = function()
{
	return this.getFirstWithSeverity(oFF.Severity.ERROR);
};
oFF.MessageManagerSimple.prototype.getFirstWithSeverity = function(severity)
{
	let size = this.getOrCreateMessages().size();
	for (let i = 0; i < size; i++)
	{
		let msg = this.getOrCreateMessages().get(i);
		if (msg.getSeverity() === severity)
		{
			return msg;
		}
	}
	return null;
};
oFF.MessageManagerSimple.prototype.getInfos = function()
{
	return this.getMessagesBySeverity(oFF.Severity.INFO);
};
oFF.MessageManagerSimple.prototype.getMessage = function(severity, code)
{
	for (let i = 0; i < this.getOrCreateMessages().size(); i++)
	{
		let message = this.getOrCreateMessages().get(i);
		if (oFF.notNull(message) && message.getCode() === code && message.getSeverity() === severity)
		{
			return message;
		}
	}
	return null;
};
oFF.MessageManagerSimple.prototype.getMessages = function()
{
	return this.getOrCreateMessages();
};
oFF.MessageManagerSimple.prototype.getMessagesBySeverity = function(severity)
{
	let returnList = oFF.XList.create();
	let size = this.getOrCreateMessages().size();
	for (let i = 0; i < size; i++)
	{
		let msg = this.getOrCreateMessages().get(i);
		if (msg.getSeverity() === severity)
		{
			returnList.add(msg);
		}
	}
	return returnList;
};
oFF.MessageManagerSimple.prototype.getNumberOfErrors = function()
{
	return this.getNumberOfSeverity(oFF.Severity.ERROR);
};
oFF.MessageManagerSimple.prototype.getNumberOfSeverity = function(severity)
{
	let count = 0;
	let size = this.getOrCreateMessages().size();
	for (let i = 0; i < size; i++)
	{
		if (this.getOrCreateMessages().get(i).getSeverity() === severity)
		{
			count++;
		}
	}
	return count;
};
oFF.MessageManagerSimple.prototype.getNumberOfWarnings = function()
{
	return this.getNumberOfSeverity(oFF.Severity.WARNING);
};
oFF.MessageManagerSimple.prototype.getOrCreateMessages = function()
{
	if (oFF.isNull(this.m_messages))
	{
		this.m_messages = oFF.XList.create();
	}
	return this.m_messages;
};
oFF.MessageManagerSimple.prototype.getProfileNodeText = function()
{
	return this.m_profileNode.getProfileNodeText();
};
oFF.MessageManagerSimple.prototype.getProfileSteps = function()
{
	return this.m_profileNode.getProfileSteps();
};
oFF.MessageManagerSimple.prototype.getProfilingEnd = function()
{
	return this.m_profileNode.getProfilingEnd();
};
oFF.MessageManagerSimple.prototype.getProfilingStart = function()
{
	return this.m_profileNode.getProfilingStart();
};
oFF.MessageManagerSimple.prototype.getRootProfileNode = function()
{
	return this.m_profileNode;
};
oFF.MessageManagerSimple.prototype.getSemanticalErrors = function()
{
	return this.getMessagesBySeverity(oFF.Severity.SEMANTICAL_ERROR);
};
oFF.MessageManagerSimple.prototype.getServerStatusCode = function()
{
	return this.m_serverStatusCode;
};
oFF.MessageManagerSimple.prototype.getServerStatusDetails = function()
{
	return this.m_serverStatusDetails;
};
oFF.MessageManagerSimple.prototype.getSummary = function()
{
	let sb = oFF.XStringBuffer.create();
	if (this.getOrCreateMessages().hasElements())
	{
		let iterator = this.getOrCreateMessages().getIterator();
		let first = true;
		while (iterator.hasNext())
		{
			if (first)
			{
				first = false;
			}
			else
			{
				sb.appendNewLine();
			}
			sb.append(iterator.next().toString());
		}
		oFF.XObjectExt.release(iterator);
	}
	return sb.toString();
};
oFF.MessageManagerSimple.prototype.getWarnings = function()
{
	return this.getMessagesBySeverity(oFF.Severity.WARNING);
};
oFF.MessageManagerSimple.prototype.hasErrors = function()
{
	return this.hasSeverity(oFF.Severity.ERROR);
};
oFF.MessageManagerSimple.prototype.hasProfileParent = function()
{
	return this.m_profileNode.hasProfileParent();
};
oFF.MessageManagerSimple.prototype.hasSeverity = function(severity)
{
	let size = this.getOrCreateMessages().size();
	for (let i = 0; i < size; i++)
	{
		if (this.getOrCreateMessages().get(i).getSeverity() === severity)
		{
			return true;
		}
	}
	return false;
};
oFF.MessageManagerSimple.prototype.hasWarnings = function()
{
	return this.hasSeverity(oFF.Severity.WARNING);
};
oFF.MessageManagerSimple.prototype.isValid = function()
{
	return !this.hasErrors();
};
oFF.MessageManagerSimple.prototype.releaseObject = function()
{
	this.m_messages = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.getOrCreateMessages());
	this.m_profileNode = oFF.XObjectExt.release(this.m_profileNode);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.MessageManagerSimple.prototype.renameLastProfileStep = function(text)
{
	this.m_profileNode.renameLastProfileStep(text);
};
oFF.MessageManagerSimple.prototype.setClientStatusCode = function(statusCode)
{
	this.m_clientStatusCode = statusCode;
};
oFF.MessageManagerSimple.prototype.setServerStatusCode = function(statusCode)
{
	this.m_serverStatusCode = statusCode;
};
oFF.MessageManagerSimple.prototype.setServerStatusDetails = function(statusDetails)
{
	this.m_serverStatusDetails = statusDetails;
};
oFF.MessageManagerSimple.prototype.setup = function()
{
	oFF.XObjectExt.prototype.setup.call( this );
	this.m_messages = oFF.XList.create();
	this.m_profileNode = oFF.ProfileNode.create(this.getClassName(), 0);
};
oFF.MessageManagerSimple.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	if (this.getOrCreateMessages().isEmpty())
	{
		sb.appendLine("No errors - everything OK");
	}
	else
	{
		sb.appendLine("Messages");
		sb.append(this.getSummary());
	}
	return sb.toString();
};

oFF.XDateTimeFactoryImpl = function() {};
oFF.XDateTimeFactoryImpl.prototype = new oFF.XDateTimeFactory();
oFF.XDateTimeFactoryImpl.prototype._ff_c = "XDateTimeFactoryImpl";

oFF.XDateTimeFactoryImpl.staticSetup = function()
{
	oFF.XDateTimeFactory.s_instance = new oFF.XDateTimeFactoryImpl();
};
oFF.XDateTimeFactoryImpl.prototype.createCurrentLocalDate = function()
{
	return oFF.XDate.createCurrentLocalDate();
};
oFF.XDateTimeFactoryImpl.prototype.createDateFromIsoFormat = function(date)
{
	return oFF.XDate.createDateFromIsoFormat(date);
};
oFF.XDateTimeFactoryImpl.prototype.createDateFromSAPFormat = function(date)
{
	return oFF.XDate.createDateFromSAPFormat(date);
};
oFF.XDateTimeFactoryImpl.prototype.createDateFromString = function(date, valueFormat)
{
	return oFF.XDate.createDateFromString(date, valueFormat);
};
oFF.XDateTimeFactoryImpl.prototype.createDateFromStringWithFlag = function(date, isSapFormat)
{
	return oFF.XDate.createDateFromStringWithFlag(date, isSapFormat);
};
oFF.XDateTimeFactoryImpl.prototype.createDateSafe = function(date)
{
	return oFF.XDate.createDateSafe(date);
};
oFF.XDateTimeFactoryImpl.prototype.createDateTime = function()
{
	return oFF.XDateTime.create();
};
oFF.XDateTimeFactoryImpl.prototype.createDateWithValues = function(year, month, day)
{
	return oFF.XDate.createDateWithValues(year, month, day);
};
oFF.XDateTimeFactoryImpl.prototype.createTime = function()
{
	return oFF.XTime.createLocalTime();
};
oFF.XDateTimeFactoryImpl.prototype.createWithMillis = function(timeInMillis)
{
	return oFF.XDate.createWithMillis(timeInMillis);
};

oFF.XGregorianCalendar = function() {};
oFF.XGregorianCalendar.prototype = new oFF.XCalendar();
oFF.XGregorianCalendar.prototype._ff_c = "XGregorianCalendar";

oFF.XGregorianCalendar.AD = 1;
oFF.XGregorianCalendar.BC = 0;
oFF.XGregorianCalendar.ERA_TO_EPOCH_DAYS = 719162;
oFF.XGregorianCalendar.FOURHUNDRED_YEARS_IN_DAYS = 146097;
oFF.XGregorianCalendar.FOUR_YEARS_IN_DAYS = 1461;
oFF.XGregorianCalendar.GREGORIAN_CUTOVER_MILLIS = -12219292800000;
oFF.XGregorianCalendar.HUNDRED_YEARS_IN_DAYS = 36524;
oFF.XGregorianCalendar.create = function()
{
	return oFF.XGregorianCalendar.createWithTimeZone(oFF.XSimpleTimeZone.create());
};
oFF.XGregorianCalendar.createTimestampArray = function()
{
	let timestamp = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	for (let i = 0; i < timestamp.size(); i++)
	{
		timestamp.set(i, oFF.XCalendar.TIMESTAMP_INVALID);
	}
	return timestamp;
};
oFF.XGregorianCalendar.createWithLocale = function(locale)
{
	return null;
};
oFF.XGregorianCalendar.createWithTimeZone = function(timeZone)
{
	let instance = new oFF.XGregorianCalendar();
	instance.m_fields = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	instance.m_isSet = oFF.XArray.create(oFF.DateConstants.FIELD_COUNT);
	instance.instantiateIsSet();
	instance.m_timestamp = oFF.XGregorianCalendar.createTimestampArray();
	instance.m_isLenient = true;
	instance.m_timeZone = timeZone;
	instance.setMinimalDaysInFirstWeek(1);
	return instance;
};
oFF.XGregorianCalendar.createWithTimeZoneAndLocale = function(timeZone, locale)
{
	return null;
};
oFF.XGregorianCalendar.createWithYearMonthDay = function(year, month, day)
{
	let instance = oFF.XGregorianCalendar.createWithTimeZone(oFF.XSimpleTimeZone.create());
	instance.set(year, month, day);
	return instance;
};
oFF.XGregorianCalendar.prototype.add = function(field, amountIn)
{
	let amount = amountIn + 0;
	if (field < 0 || field >= oFF.DateConstants.FIELD_COUNT)
	{
		let firstPartMessage = oFF.XStringUtils.concatenateWithInt("field value", field);
		let secondPartMessage = oFF.XStringUtils.concatenateWithInt(" out of range [0...", oFF.DateConstants.FIELD_COUNT - 1);
		let thirdPartMessage = "]";
		let message = oFF.XStringUtils.concatenate3(firstPartMessage, secondPartMessage, thirdPartMessage);
		throw oFF.XException.createIllegalArgumentException(message);
	}
	if (amount === 0)
	{
		return;
	}
	this.complete();
	let year;
	if (field === oFF.DateConstants.ERA)
	{
		this.setField(oFF.DateConstants.ERA, oFF.XGregorianCalendar.AD);
	}
	else if (field === oFF.DateConstants.YEAR)
	{
		year = oFF.XLong.convertToInt(this.internalGet(oFF.DateConstants.YEAR) + amount);
		if (!this.isValidGregorianDate(year, 12, 31))
		{
			return;
		}
		this.setField(oFF.DateConstants.YEAR, year);
		let isFeb29 = this.internalGet(oFF.DateConstants.MONTH) === oFF.DateConstants.FEBRUARY && this.internalGet(oFF.DateConstants.DAY_OF_MONTH) === 29;
		let isCommonYear = !this.isLeapYear(year);
		if (isFeb29 && isCommonYear)
		{
			this.setField(oFF.DateConstants.DAY_OF_MONTH, 28);
		}
	}
	else if (field === oFF.DateConstants.MONTH || field === oFF.DateConstants.QUARTER || field === oFF.DateConstants.HALF_YEAR)
	{
		year = this.internalGet(oFF.DateConstants.YEAR);
		let month = this.internalGet(oFF.DateConstants.MONTH);
		let monthAmount = field === oFF.DateConstants.QUARTER ? amount * 3 : field === oFF.DateConstants.HALF_YEAR ? amount * 6 : amount;
		let months = oFF.XLong.convertToInt(year * 12 + month + monthAmount);
		let newYear = oFF.XMath.div(months, 12);
		if (year !== newYear)
		{
			this.setField(oFF.DateConstants.YEAR, newYear);
		}
		let newMonth = oFF.XMath.mod(months, 12);
		if (month !== newMonth)
		{
			this.setField(oFF.DateConstants.MONTH, newMonth);
		}
		let dayOfMonth = this.internalGet(oFF.DateConstants.DAY_OF_MONTH);
		let maxDayOfMonth = this.getDaysInMonth(newYear, oFF.XMath.max(newMonth, 1));
		if (dayOfMonth > maxDayOfMonth)
		{
			this.setField(oFF.DateConstants.DAY_OF_MONTH, maxDayOfMonth);
		}
	}
	else if (field === oFF.DateConstants.WEEK_OF_YEAR || field === oFF.DateConstants.WEEK_OF_MONTH || field === oFF.DateConstants.DAY_OF_WEEK_IN_MONTH)
	{
		this.addMillisWithDST(amount * oFF.DateConstants.WEEK_IN_MILLIS);
	}
	else if (field === oFF.DateConstants.DAY_OF_MONTH || field === oFF.DateConstants.DAY_OF_YEAR || field === oFF.DateConstants.DAY_OF_WEEK)
	{
		this.addMillisWithDST(amount * oFF.DateConstants.DAY_IN_MILLIS);
	}
	else if (field === oFF.DateConstants.AM_PM)
	{
		this.addMillisWithDST(amount * 12 * oFF.DateConstants.HOUR_IN_MILLIS);
	}
	else if (field === oFF.DateConstants.HOUR || field === oFF.DateConstants.HOUR_OF_DAY)
	{
		this.addMillis(amount * oFF.DateConstants.HOUR_IN_MILLIS);
	}
	else if (field === oFF.DateConstants.MINUTE)
	{
		this.addMillis(amount * oFF.DateConstants.MINUTE_IN_MILLIS);
	}
	else if (field === oFF.DateConstants.SECOND)
	{
		this.addMillis(amount * oFF.DateConstants.SECOND_IN_MILLIS);
	}
	else if (field === oFF.DateConstants.MILLISECOND)
	{
		this.addMillis(amount);
	}
	else if (field === oFF.DateConstants.ZONE_OFFSET)
	{
		throw oFF.XException.createIllegalArgumentException("Adding time zone offsets is not supported.");
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException("Adding DST offsets is not supported.");
	}
};
oFF.XGregorianCalendar.prototype.addMillis = function(millis)
{
	this.setTimeInMillis(this.m_time + millis);
};
oFF.XGregorianCalendar.prototype.addMillisWithDST = function(millis)
{
	let isDSTBefore = this.getDaylightSavingTimeOffsetMillis(this.getTimeZone(), this.m_time) !== 0;
	let isDSTAfter = this.getDaylightSavingTimeOffsetMillis(this.getTimeZone(), this.m_time + millis) !== 0;
	let daylightSavingTimeOffsetMillis = 0;
	let enterDST = !isDSTBefore && isDSTAfter;
	if (enterDST)
	{
		daylightSavingTimeOffsetMillis = this.getDaylightSavingTimeOffsetMillis(this.getTimeZone(), this.m_time + millis);
	}
	let millis2 = millis - daylightSavingTimeOffsetMillis;
	this.addMillis(millis2);
};
oFF.XGregorianCalendar.prototype.checkFields = function()
{
	for (let i = 0; i < this.m_fields.size(); i++)
	{
		if (this.m_isSet.get(i).getBoolean())
		{
			let value = this.internalGet(i);
			let min = this.getMinimum(i);
			let max = this.getMaximum(i);
			if (value < min || value > max)
			{
				throw oFF.XException.createIllegalArgumentException("");
			}
		}
	}
};
oFF.XGregorianCalendar.prototype.clampDate = function()
{
	let year = this.internalGet(oFF.DateConstants.YEAR);
	let oneBasedMonth = this.internalGet(oFF.DateConstants.MONTH) + 1;
	let dayOfMonth = this.internalGet(oFF.DateConstants.DAY_OF_MONTH);
	if (!this.isValidGregorianDate(year, oneBasedMonth, dayOfMonth))
	{
		if (year > 9999)
		{
			this.setField(oFF.DateConstants.YEAR, 9999);
			this.setField(oFF.DateConstants.MONTH, oFF.DateConstants.DECEMBER);
			this.setField(oFF.DateConstants.DAY_OF_MONTH, 31);
		}
		else
		{
			this.setField(oFF.DateConstants.YEAR, 1582);
			this.setField(oFF.DateConstants.MONTH, oFF.DateConstants.OCTOBER);
			this.setField(oFF.DateConstants.DAY_OF_MONTH, 15);
		}
	}
};
oFF.XGregorianCalendar.prototype.computeFields = function()
{
	let timeZone = this.getTimeZone();
	let timeZoneOffsetInMillis = this.getTimeZoneOffsetMillis(timeZone);
	this.internalSet(oFF.DateConstants.ZONE_OFFSET, timeZoneOffsetInMillis);
	let daylightSavingTimeOffsetMillis = this.getDaylightSavingTimeOffsetMillis(timeZone, this.m_time);
	this.internalSet(oFF.DateConstants.DST_OFFSET, daylightSavingTimeOffsetMillis);
	let localWallEraMillis = 1 * oFF.XGregorianCalendar.ERA_TO_EPOCH_DAYS * oFF.DateConstants.DAY_IN_MILLIS + this.m_time + timeZoneOffsetInMillis + daylightSavingTimeOffsetMillis;
	this.internalSet(oFF.DateConstants.ERA, oFF.XGregorianCalendar.AD);
	let eraDays = oFF.XMath.longDiv(localWallEraMillis, oFF.DateConstants.DAY_IN_MILLIS);
	let tmpEraDays = eraDays;
	let year400 = oFF.XLong.convertToInt(oFF.XMath.longDiv(tmpEraDays, oFF.XGregorianCalendar.FOURHUNDRED_YEARS_IN_DAYS));
	tmpEraDays = tmpEraDays - year400 * oFF.XGregorianCalendar.FOURHUNDRED_YEARS_IN_DAYS;
	let year100 = oFF.XLong.convertToInt(oFF.XMath.longDiv(tmpEraDays, oFF.XGregorianCalendar.HUNDRED_YEARS_IN_DAYS));
	tmpEraDays = tmpEraDays - year100 * oFF.XGregorianCalendar.HUNDRED_YEARS_IN_DAYS;
	let year4 = oFF.XLong.convertToInt(oFF.XMath.longDiv(tmpEraDays, oFF.XGregorianCalendar.FOUR_YEARS_IN_DAYS));
	tmpEraDays = tmpEraDays - year4 * oFF.XGregorianCalendar.FOUR_YEARS_IN_DAYS;
	let year1 = oFF.XLong.convertToInt(oFF.XMath.longDiv(tmpEraDays, oFF.DateConstants.ONE_YEAR_IN_DAYS));
	if (year1 > 3)
	{
		year1 = 3;
	}
	tmpEraDays = tmpEraDays - year1 * oFF.DateConstants.ONE_YEAR_IN_DAYS;
	let year = year400 * 400 + year100 * 100 + year4 * 4 + year1 + 1;
	this.internalSet(oFF.DateConstants.YEAR, year);
	let dayOfYear = oFF.XLong.convertToInt(tmpEraDays + 1);
	this.internalSet(oFF.DateConstants.DAY_OF_YEAR, dayOfYear);
	let month = this.getMonth(year, dayOfYear);
	this.internalSet(oFF.DateConstants.MONTH, month);
	this.internalSet(oFF.DateConstants.HALF_YEAR, month <= 6 ? 1 : 2);
	this.internalSet(oFF.DateConstants.QUARTER, month < 4 ? 1 : month < 7 ? 2 : month < 10 ? 3 : 4);
	let dayOfMonth = this.getDayOfMonth(year, dayOfYear);
	this.internalSet(oFF.DateConstants.DAY_OF_MONTH, dayOfMonth);
	let eraDaysToBeginOfYear = oFF.XLong.convertToInt(eraDays - (dayOfYear - 1));
	let dayOfWeek = this.getDayOfWeek(eraDaysToBeginOfYear, dayOfYear);
	this.internalSet(oFF.DateConstants.DAY_OF_WEEK, dayOfWeek);
	let firstOfJanuaryAsDayOfYear = 1;
	let weekOfYear = this.getWeekNumber(eraDaysToBeginOfYear, dayOfYear, firstOfJanuaryAsDayOfYear);
	if (weekOfYear < 1)
	{
		let eraDaysToBeginOfPreviousYear = this.getEraDaysToBeginOfYear(year - 1);
		let previousDec31AsDayOfYear = this.getDayOfYear(year - 1, 12, 31);
		weekOfYear = this.getWeekNumber(eraDaysToBeginOfPreviousYear, previousDec31AsDayOfYear, firstOfJanuaryAsDayOfYear);
	}
	else if (weekOfYear > 52)
	{
		let eraDaysToBeginOfNextYear = this.getEraDaysToBeginOfYear(year + 1);
		let weekNumber = this.getWeekNumber(eraDaysToBeginOfNextYear, firstOfJanuaryAsDayOfYear, firstOfJanuaryAsDayOfYear);
		if (weekNumber > 0)
		{
			weekOfYear = 1;
		}
	}
	this.internalSet(oFF.DateConstants.WEEK_OF_YEAR, weekOfYear);
	let firstOfMonthAsDayOfYear = this.getDayOfYear(year, month, 1);
	let weekOfMonth = this.getWeekNumber(eraDaysToBeginOfYear, dayOfYear, firstOfMonthAsDayOfYear);
	this.internalSet(oFF.DateConstants.WEEK_OF_MONTH, weekOfMonth);
	let dayOfWeekInMonth = oFF.XMath.div(dayOfMonth - 1, 7) + 1;
	this.internalSet(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, dayOfWeekInMonth);
	let millisOfDay = oFF.XMath.longMod(localWallEraMillis, oFF.DateConstants.DAY_IN_MILLIS);
	let hourOfDay = oFF.XLong.convertToInt(oFF.XMath.longDiv(millisOfDay, oFF.DateConstants.HOUR_IN_MILLIS));
	millisOfDay = millisOfDay - hourOfDay * oFF.DateConstants.HOUR_IN_MILLIS;
	this.internalSet(oFF.DateConstants.HOUR_OF_DAY, hourOfDay);
	let amPm = hourOfDay < 12 ? oFF.DateConstants.AM : oFF.DateConstants.PM;
	this.internalSet(oFF.DateConstants.AM_PM, amPm);
	let hour = oFF.XMath.mod(hourOfDay, 12);
	this.internalSet(oFF.DateConstants.HOUR, hour);
	let minute = oFF.XLong.convertToInt(oFF.XMath.longDiv(millisOfDay, oFF.DateConstants.MINUTE_IN_MILLIS));
	millisOfDay = millisOfDay - minute * oFF.DateConstants.MINUTE_IN_MILLIS;
	this.internalSet(oFF.DateConstants.MINUTE, minute);
	let second = oFF.XLong.convertToInt(oFF.XMath.longDiv(millisOfDay, oFF.DateConstants.SECOND_IN_MILLIS));
	millisOfDay = millisOfDay - second * oFF.DateConstants.SECOND_IN_MILLIS;
	this.internalSet(oFF.DateConstants.SECOND, second);
	this.internalSet(oFF.DateConstants.MILLISECOND, oFF.XLong.convertToInt(millisOfDay));
	for (let i = 0; i < this.m_isSet.size(); i++)
	{
		this.m_isSet.set(i, oFF.XBooleanValue.create(true));
	}
	for (let j = 0; j < this.m_timestamp.size(); j++)
	{
		this.m_timestamp.set(j, oFF.XCalendar.TIMESTAMP_OVERRIDE);
	}
};
oFF.XGregorianCalendar.prototype.computeTime = function()
{
	if (this.isLenient() === false)
	{
		this.checkFields();
	}
	let isRead = this.createIsReadArray();
	isRead.set(oFF.DateConstants.ERA, oFF.XBooleanValue.create(true));
	let year = 1970;
	if (this.m_timestamp.get(oFF.DateConstants.YEAR) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		year = this.internalGet(oFF.DateConstants.YEAR);
	}
	isRead.set(oFF.DateConstants.YEAR, oFF.XBooleanValue.create(true));
	let eraDaysToBeginOfYear = this.getEraDaysToBeginOfYear(year);
	let daysIntoYear = 0;
	let rule = this.getRule();
	let dayOfWeek;
	let offsetOfDaysIntoWeek;
	let weeksToAdd;
	let addDays;
	if (rule === 1 || rule === 2 || rule === 3)
	{
		let month = oFF.DateConstants.JANUARY;
		if (this.m_timestamp.get(oFF.DateConstants.MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
		{
			month = this.internalGet(oFF.DateConstants.MONTH);
			isRead.set(oFF.DateConstants.MONTH, oFF.XBooleanValue.create(true));
		}
		let months = (year - 1) * 12 + month - 1;
		year = oFF.XMath.div(months, 12) + 1;
		month = oFF.XMath.mod(months, 12) + 1;
		eraDaysToBeginOfYear = this.getEraDaysToBeginOfYear(year);
		if (this.isLeapYear(year))
		{
			daysIntoYear = daysIntoYear + oFF.DateConstants.DAYS_IN_LEAP_YEAR.get(month - 1);
		}
		else
		{
			daysIntoYear = daysIntoYear + oFF.DateConstants.DAYS_IN_COMMON_YEAR.get(month - 1);
		}
		if (rule === 1)
		{
			let dayOfMonth = 1;
			if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
			{
				dayOfMonth = this.internalGet(oFF.DateConstants.DAY_OF_MONTH);
				isRead.set(oFF.DateConstants.DAY_OF_MONTH, oFF.XBooleanValue.create(true));
			}
			daysIntoYear = daysIntoYear + dayOfMonth - 1;
		}
		else if (rule === 2)
		{
			daysIntoYear = 0;
			let weekOfMonth = this.internalGet(oFF.DateConstants.WEEK_OF_MONTH);
			isRead.set(oFF.DateConstants.WEEK_OF_MONTH, oFF.XBooleanValue.create(true));
			dayOfWeek = this.internalGet(oFF.DateConstants.DAY_OF_WEEK);
			isRead.set(oFF.DateConstants.DAY_OF_WEEK, oFF.XBooleanValue.create(true));
			let firstDayOfWeek = this.getFirstDayOfWeek();
			let firstDayOfMonthAsDayOfYear = this.getDayOfYear(year, month, 1);
			let offsetToFirstDayOfWeekOfFirstOfMonth = this.getFirstDayOfWeekAsDayOfYear(eraDaysToBeginOfYear, firstDayOfMonthAsDayOfYear);
			let weekOfMonthOfFirstOfMonth = this.getWeekNumber(eraDaysToBeginOfYear, firstDayOfMonthAsDayOfYear, firstDayOfMonthAsDayOfYear);
			weeksToAdd = weekOfMonth - weekOfMonthOfFirstOfMonth;
			offsetOfDaysIntoWeek = this.getOffsetOfDaysIntoWeek(firstDayOfWeek, dayOfWeek);
			addDays = offsetToFirstDayOfWeekOfFirstOfMonth + weeksToAdd * 7 + offsetOfDaysIntoWeek - 1;
			daysIntoYear = daysIntoYear + addDays;
		}
		else if (rule === 3)
		{
			dayOfWeek = this.getFirstDayOfWeek();
			if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK) !== oFF.XCalendar.TIMESTAMP_INVALID)
			{
				dayOfWeek = this.internalGet(oFF.DateConstants.DAY_OF_WEEK);
				isRead.set(oFF.DateConstants.DAY_OF_WEEK, oFF.XBooleanValue.create(true));
			}
			let firstOfMonthAsDayOfYear = this.getDayOfYear(year, month, 1);
			let firstOfMonthAsDayOfWeek = this.getDayOfWeek(eraDaysToBeginOfYear, firstOfMonthAsDayOfYear);
			offsetOfDaysIntoWeek = this.getOffsetOfDaysIntoWeek(firstOfMonthAsDayOfWeek, dayOfWeek);
			daysIntoYear = daysIntoYear + offsetOfDaysIntoWeek;
			let dayOfWeekInMonth = 1;
			if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
			{
				dayOfWeekInMonth = this.internalGet(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH);
				isRead.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, oFF.XBooleanValue.create(true));
			}
			if (dayOfWeekInMonth < 0)
			{
				let daysInMonth = this.getDaysInMonth(year, month);
				let maxWeek = oFF.XMath.div(daysInMonth - (offsetOfDaysIntoWeek + 1), 7) + 1;
				dayOfWeekInMonth = maxWeek + dayOfWeekInMonth + 1;
			}
			daysIntoYear = daysIntoYear + (dayOfWeekInMonth - 1) * 7;
		}
	}
	else
	{
		if (rule === 4)
		{
			let dayOfYear = this.internalGet(oFF.DateConstants.DAY_OF_YEAR);
			isRead.set(oFF.DateConstants.DAY_OF_YEAR, oFF.XBooleanValue.create(true));
			daysIntoYear = daysIntoYear + dayOfYear - 1;
		}
		else if (rule === 5)
		{
			let weekOfYear = this.internalGet(oFF.DateConstants.WEEK_OF_YEAR);
			isRead.set(oFF.DateConstants.WEEK_OF_YEAR, oFF.XBooleanValue.create(true));
			let firstDayOffWeek = this.getFirstDayOfWeek();
			let firstOfJanuaryAsDayOfYear = this.getDayOfYear(year, 1, 1);
			let offsetToFirstDayOfWeekOfFirstOfJanuary = this.getFirstDayOfWeekAsDayOfYear(eraDaysToBeginOfYear, firstOfJanuaryAsDayOfYear);
			let weekOfYearOfFirstOfJanuary = this.getWeekNumber(eraDaysToBeginOfYear, firstOfJanuaryAsDayOfYear, firstOfJanuaryAsDayOfYear);
			weeksToAdd = weekOfYear - weekOfYearOfFirstOfJanuary;
			offsetOfDaysIntoWeek = 0;
			if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK) !== oFF.XCalendar.TIMESTAMP_INVALID)
			{
				dayOfWeek = this.internalGet(oFF.DateConstants.DAY_OF_WEEK);
				isRead.set(oFF.DateConstants.DAY_OF_WEEK, oFF.XBooleanValue.create(true));
				offsetOfDaysIntoWeek = this.getOffsetOfDaysIntoWeek(firstDayOffWeek, dayOfWeek);
			}
			addDays = offsetToFirstDayOfWeekOfFirstOfJanuary + weeksToAdd * 7 + offsetOfDaysIntoWeek - 1;
			daysIntoYear = daysIntoYear + addDays;
		}
	}
	let millis = (eraDaysToBeginOfYear - oFF.XGregorianCalendar.ERA_TO_EPOCH_DAYS + daysIntoYear) * oFF.DateConstants.DAY_IN_MILLIS;
	let timestampHourOfDay = this.m_timestamp.get(oFF.DateConstants.HOUR_OF_DAY);
	let timestampHour = this.m_timestamp.get(oFF.DateConstants.HOUR);
	let hour = 0;
	if (timestampHour > timestampHourOfDay)
	{
		if (timestampHour !== oFF.XCalendar.TIMESTAMP_INVALID)
		{
			hour = this.internalGet(oFF.DateConstants.HOUR);
			isRead.set(oFF.DateConstants.HOUR, oFF.XBooleanValue.create(true));
			let timestampAmPm = this.m_timestamp.get(oFF.DateConstants.AM_PM);
			if (timestampAmPm !== oFF.XCalendar.TIMESTAMP_INVALID)
			{
				let amPm = this.internalGet(oFF.DateConstants.AM_PM);
				isRead.set(oFF.DateConstants.AM_PM, oFF.XBooleanValue.create(true));
				hour = hour + 12 * amPm;
			}
		}
	}
	else
	{
		if (timestampHourOfDay !== oFF.XCalendar.TIMESTAMP_INVALID)
		{
			hour = this.internalGet(oFF.DateConstants.HOUR_OF_DAY);
			isRead.set(oFF.DateConstants.HOUR_OF_DAY, oFF.XBooleanValue.create(true));
		}
	}
	let minute = 0;
	if (this.m_timestamp.get(oFF.DateConstants.MINUTE) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		minute = this.internalGet(oFF.DateConstants.MINUTE);
		isRead.set(oFF.DateConstants.MINUTE, oFF.XBooleanValue.create(true));
	}
	let second = 0;
	if (this.m_timestamp.get(oFF.DateConstants.SECOND) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		second = this.internalGet(oFF.DateConstants.SECOND);
		isRead.set(oFF.DateConstants.SECOND, oFF.XBooleanValue.create(true));
	}
	let millisecond = 0;
	if (this.m_timestamp.get(oFF.DateConstants.MILLISECOND) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		millisecond = this.internalGet(oFF.DateConstants.MILLISECOND);
		isRead.set(oFF.DateConstants.MILLISECOND, oFF.XBooleanValue.create(true));
	}
	millis = millis + hour * oFF.DateConstants.HOUR_IN_MILLIS + minute * oFF.DateConstants.MINUTE_IN_MILLIS + second * oFF.DateConstants.SECOND_IN_MILLIS + millisecond;
	let timeZone = this.getTimeZone();
	let timeZoneOffsetMillis = 0;
	if (this.m_timestamp.get(oFF.DateConstants.ZONE_OFFSET) >= oFF.XCalendar.TIMESTAMP_MINIMUM)
	{
		timeZoneOffsetMillis = this.internalGet(oFF.DateConstants.ZONE_OFFSET);
		isRead.set(oFF.DateConstants.ZONE_OFFSET, oFF.XBooleanValue.create(true));
	}
	else
	{
		timeZoneOffsetMillis = this.getTimeZoneOffsetMillis(timeZone);
	}
	millis = millis - timeZoneOffsetMillis;
	let daylightSavingsTimeOffsetMillis = 0;
	if (this.m_timestamp.get(oFF.DateConstants.DST_OFFSET) >= oFF.XCalendar.TIMESTAMP_MINIMUM)
	{
		daylightSavingsTimeOffsetMillis = this.internalGet(oFF.DateConstants.DST_OFFSET);
		isRead.set(oFF.DateConstants.DST_OFFSET, oFF.XBooleanValue.create(true));
	}
	else
	{
		daylightSavingsTimeOffsetMillis = this.getDaylightSavingTimeOffsetMillis(timeZone, millis);
	}
	let isDSTNow = this.getDaylightSavingTimeOffsetMillis(timeZone, millis) !== 0;
	let isDSTOneHourAgo = this.getDaylightSavingTimeOffsetMillis(timeZone, millis - oFF.DateConstants.HOUR_IN_MILLIS) !== 0;
	let enterDST = isDSTNow === true && isDSTOneHourAgo === false;
	if (enterDST)
	{
		daylightSavingsTimeOffsetMillis = 0;
	}
	millis = millis - daylightSavingsTimeOffsetMillis;
	this.m_time = millis;
	for (let field = 0; field < this.m_fields.size(); field++)
	{
		if (this.m_isSet.get(field).getBoolean() && isRead.get(field).getBoolean())
		{
			this.m_isSet.set(field, oFF.XBooleanValue.create(true));
			this.m_timestamp.set(field, oFF.XCalendar.TIMESTAMP_OVERRIDE);
		}
		else
		{
			this.m_isSet.set(field, oFF.XBooleanValue.create(false));
			this.m_fields.set(field, 0);
			this.m_timestamp.set(field, oFF.XCalendar.TIMESTAMP_INVALID);
			this.m_areFieldsSet = false;
		}
	}
};
oFF.XGregorianCalendar.prototype.createIsReadArray = function()
{
	let isRead = oFF.XArray.create(oFF.DateConstants.FIELD_COUNT);
	for (let i = 0; i < isRead.size(); i++)
	{
		isRead.set(i, oFF.XBooleanValue.create(false));
	}
	return isRead;
};
oFF.XGregorianCalendar.prototype.getActualMaximum = function(field)
{
	if (field < 0 || field >= oFF.DateConstants.FIELD_COUNT)
	{
		let firstPartMessage = oFF.XStringUtils.concatenateWithInt("field value", field);
		let secondPartMessage = oFF.XStringUtils.concatenateWithInt(" out of range [0...", oFF.DateConstants.FIELD_COUNT - 1);
		let thirdPartMessage = "]";
		let message = oFF.XStringUtils.concatenate3(firstPartMessage, secondPartMessage, thirdPartMessage);
		throw oFF.XException.createIllegalArgumentException(message);
	}
	let actualMaximum;
	let year;
	if (field === oFF.DateConstants.WEEK_OF_YEAR || field === oFF.DateConstants.WEEK_OF_MONTH || field === oFF.DateConstants.DAY_OF_WEEK_IN_MONTH)
	{
		actualMaximum = oFF.XCalendar.prototype.getActualMaximum.call( this , field);
		return actualMaximum;
	}
	else if (field === oFF.DateConstants.DAY_OF_MONTH)
	{
		year = this.internalGet(oFF.DateConstants.YEAR);
		let oneBasedMonth = this.internalGet(oFF.DateConstants.MONTH) + 1;
		return this.getDaysInMonth(year, oneBasedMonth);
	}
	else if (field === oFF.DateConstants.DAY_OF_YEAR)
	{
		year = this.internalGet(oFF.DateConstants.YEAR);
		return this.isLeapYear(year) ? 366 : 365;
	}
	else
	{
		actualMaximum = this.getMaximum(field);
		return actualMaximum;
	}
};
oFF.XGregorianCalendar.prototype.getActualMinimum = function(field)
{
	return this.getMinimum(field);
};
oFF.XGregorianCalendar.prototype.getDayOfMonth = function(year, dayOfYear)
{
	let dayOfMonth = -1;
	let dayInYear = dayOfYear - 1;
	let daysInYear = this.isLeapYear(year) ? oFF.DateConstants.DAYS_IN_LEAP_YEAR : oFF.DateConstants.DAYS_IN_COMMON_YEAR;
	for (let i = 1; i <= 12; i++)
	{
		if (dayInYear < daysInYear.get(i))
		{
			dayOfMonth = dayInYear - daysInYear.get(i - 1) + 1;
			break;
		}
	}
	return dayOfMonth;
};
oFF.XGregorianCalendar.prototype.getDayOfWeek = function(eraDaysToBeginYear, dayOfYear)
{
	let DAY_OF_WEEK_1_JAN_AD = oFF.DateConstants.MONDAY;
	let eraDays = eraDaysToBeginYear + dayOfYear - 1;
	return oFF.XMath.mod(eraDays + DAY_OF_WEEK_1_JAN_AD - 1, 7) + 1;
};
oFF.XGregorianCalendar.prototype.getDayOfYear = function(year, onBasedMonth, day)
{
	let month = onBasedMonth - 1;
	return this.isLeapYear(year) ? oFF.DateConstants.DAYS_IN_LEAP_YEAR.get(month) + day : oFF.DateConstants.DAYS_IN_COMMON_YEAR.get(month) + day;
};
oFF.XGregorianCalendar.prototype.getDaylightSavingTimeOffsetMillis = function(timeZone, millis)
{
	let offsetMillis = 0;
	if (timeZone.inDaylightTime(oFF.XDateTime.createWithMilliseconds(millis)))
	{
		offsetMillis = timeZone.getDSTSavings();
	}
	return offsetMillis;
};
oFF.XGregorianCalendar.prototype.getDaysInMonth = function(year, onBasedMonth)
{
	let daysInMonth = oFF.DateConstants.DAYS_IN_MONTH.get(onBasedMonth - 1);
	if (onBasedMonth === oFF.DateConstants.FEBRUARY && this.isLeapYear(year))
	{
		daysInMonth++;
	}
	return daysInMonth;
};
oFF.XGregorianCalendar.prototype.getEraDaysToBeginOfYear = function(yearIn)
{
	let year = yearIn;
	year = year - 1;
	let year400 = oFF.XMath.div(year, 400);
	year = year - year400 * 400;
	let year100 = oFF.XMath.div(year, 100);
	year = year - year100 * 100;
	let year4 = oFF.XMath.div(year, 4);
	year = year - year4 * 4;
	return oFF.XGregorianCalendar.FOURHUNDRED_YEARS_IN_DAYS * year400 + oFF.XGregorianCalendar.HUNDRED_YEARS_IN_DAYS * year100 + oFF.XGregorianCalendar.FOUR_YEARS_IN_DAYS * year4 + oFF.DateConstants.ONE_YEAR_IN_DAYS * year;
};
oFF.XGregorianCalendar.prototype.getFirstDayOfWeekAsDayOfYear = function(eraDaysToBeginYear, dayOfYear)
{
	let dayOfWeek = this.getDayOfWeek(eraDaysToBeginYear, dayOfYear);
	let firstDayOfWeek = this.getFirstDayOfWeek();
	if (dayOfWeek < firstDayOfWeek)
	{
		dayOfWeek = dayOfWeek + 7;
	}
	return dayOfYear - (dayOfWeek - firstDayOfWeek);
};
oFF.XGregorianCalendar.prototype.getGreatestMinimum = function(field)
{
	return oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.get(field);
};
oFF.XGregorianCalendar.prototype.getGregorianChange = function()
{
	return oFF.XDateTime.createWithMilliseconds(oFF.XGregorianCalendar.GREGORIAN_CUTOVER_MILLIS);
};
oFF.XGregorianCalendar.prototype.getLeastMaximum = function(field)
{
	return oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.get(field);
};
oFF.XGregorianCalendar.prototype.getMaximum = function(field)
{
	return oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.get(field);
};
oFF.XGregorianCalendar.prototype.getMinimum = function(field)
{
	return oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.get(field);
};
oFF.XGregorianCalendar.prototype.getMonth = function(year, dayOfYear)
{
	let month = -1;
	let dayInYear = dayOfYear - 1;
	let daysInYear = this.isLeapYear(year) ? oFF.DateConstants.DAYS_IN_LEAP_YEAR : oFF.DateConstants.DAYS_IN_COMMON_YEAR;
	for (let i = 1; i <= 12; i++)
	{
		if (dayInYear < daysInYear.get(i))
		{
			month = i;
			break;
		}
	}
	return month;
};
oFF.XGregorianCalendar.prototype.getOffsetOfDaysIntoWeek = function(firstDayOfWeek, dayOfWeek)
{
	let offset = dayOfWeek - firstDayOfWeek;
	if (offset < 0)
	{
		offset = offset + 7;
	}
	return offset;
};
oFF.XGregorianCalendar.prototype.getRule = function()
{
	let bestTs = oFF.XCalendar.TIMESTAMP_INVALID;
	let rule = -1;
	let tsMonth = this.m_timestamp.get(oFF.DateConstants.MONTH);
	let tsDayOfMonth = this.m_timestamp.get(oFF.DateConstants.DAY_OF_MONTH);
	let tsWeekOfMonth = this.m_timestamp.get(oFF.DateConstants.WEEK_OF_MONTH);
	let tsDayOfWeek = this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK);
	let tsDayOfWeekInMonth = this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH);
	let tsDayOfYear = this.m_timestamp.get(oFF.DateConstants.DAY_OF_YEAR);
	let tsWeekOfYear = this.m_timestamp.get(oFF.DateConstants.WEEK_OF_YEAR);
	let tsRule1 = this.invalidOrMaxTimestampTwoFields(tsMonth, tsDayOfMonth);
	let tsRule2 = this.invalidOrMaxTimeStampThreeFields(tsMonth, tsWeekOfMonth, tsDayOfWeek);
	let tsRule3 = this.invalidOrMaxTimeStampThreeFields(tsMonth, tsDayOfWeekInMonth, tsDayOfWeek);
	let tsRule4 = this.invalidOrMaxTimestampOneField(tsDayOfYear);
	let tsRule5 = this.invalidOrMaxTimestampTwoFields(tsWeekOfYear, tsDayOfWeek);
	if (tsRule1 > bestTs)
	{
		bestTs = tsRule1;
		rule = 1;
	}
	if (tsRule2 > bestTs)
	{
		bestTs = tsRule2;
		rule = 2;
	}
	if (tsRule3 > bestTs)
	{
		bestTs = tsRule3;
		rule = 3;
	}
	if (tsRule4 > bestTs)
	{
		bestTs = tsRule4;
		rule = 4;
	}
	if (tsRule5 > bestTs)
	{
		bestTs = tsRule5;
		rule = 5;
	}
	if (rule !== -1)
	{
		return rule;
	}
	let tsWeekOfMonthDayOfWeek = this.invalidOrMaxTimestampTwoFields(tsWeekOfMonth, tsDayOfWeek);
	let tsDayOfWeekInMonthDayOfWeek = this.invalidOrMaxTimestampTwoFields(tsDayOfWeekInMonth, tsDayOfWeek);
	let tsWeekOfYearDayOfWeek = this.invalidOrMaxTimestampTwoFields(tsWeekOfYear, tsDayOfWeek);
	bestTs = oFF.XCalendar.TIMESTAMP_INVALID;
	if (tsMonth > bestTs)
	{
		bestTs = tsMonth;
	}
	if (tsDayOfMonth > bestTs)
	{
		bestTs = tsDayOfMonth;
	}
	if (tsWeekOfMonthDayOfWeek > bestTs)
	{
		bestTs = tsWeekOfMonthDayOfWeek;
	}
	if (tsDayOfWeekInMonthDayOfWeek > bestTs)
	{
		bestTs = tsDayOfWeekInMonthDayOfWeek;
	}
	if (tsWeekOfYearDayOfWeek > bestTs)
	{
		bestTs = tsWeekOfYearDayOfWeek;
	}
	rule = -1;
	if (bestTs !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		if (bestTs === tsMonth)
		{
			rule = -1;
		}
		else if (bestTs === tsDayOfMonth)
		{
			rule = 1;
		}
		else if (bestTs === tsWeekOfMonthDayOfWeek)
		{
			rule = 2;
		}
		else if (bestTs === tsDayOfWeekInMonthDayOfWeek)
		{
			rule = 3;
		}
		else if (bestTs === tsWeekOfYearDayOfWeek)
		{
			rule = 5;
		}
		if (rule !== -1)
		{
			return rule;
		}
	}
	bestTs = oFF.XCalendar.TIMESTAMP_INVALID;
	if (tsMonth > bestTs)
	{
		bestTs = tsMonth;
	}
	if (tsWeekOfMonth > bestTs)
	{
		bestTs = tsWeekOfMonth;
	}
	if (tsDayOfWeek > bestTs)
	{
		bestTs = tsDayOfWeek;
	}
	if (tsDayOfWeekInMonth > bestTs)
	{
		bestTs = tsDayOfWeekInMonth;
	}
	if (tsWeekOfYear > bestTs)
	{
		bestTs = tsWeekOfYear;
	}
	rule = -1;
	if (bestTs !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		if (bestTs === tsMonth)
		{
			if (tsWeekOfMonth > tsDayOfWeekInMonth)
			{
				rule = 2;
			}
			else if (tsDayOfWeekInMonth > tsWeekOfMonth)
			{
				rule = 3;
			}
			else
			{
				rule = 1;
			}
		}
		else if (bestTs === tsWeekOfMonth)
		{
			rule = 2;
		}
		else if (bestTs === tsDayOfWeek)
		{
			bestTs = oFF.XCalendar.TIMESTAMP_INVALID;
			if (tsWeekOfYear > bestTs)
			{
				bestTs = tsWeekOfYear;
			}
			if (tsMonth > bestTs)
			{
				bestTs = tsMonth;
			}
			if (tsWeekOfMonth > bestTs)
			{
				bestTs = tsWeekOfMonth;
			}
			if (tsDayOfWeekInMonth > bestTs)
			{
				bestTs = tsDayOfWeekInMonth;
			}
			if (bestTs === oFF.XCalendar.TIMESTAMP_INVALID)
			{
				rule = 3;
			}
			else
			{
				if (bestTs === tsWeekOfMonth)
				{
					rule = 2;
				}
				else if (bestTs === tsDayOfWeekInMonth)
				{
					rule = 3;
				}
				else if (bestTs === tsWeekOfYear)
				{
					rule = 5;
				}
				else if (bestTs === tsMonth)
				{
					if (tsWeekOfMonth > tsDayOfWeekInMonth)
					{
						rule = 2;
					}
					else if (tsDayOfWeekInMonth > tsWeekOfMonth)
					{
						rule = 3;
					}
					else
					{
						rule = 3;
					}
				}
			}
		}
		else if (bestTs === tsDayOfWeekInMonth)
		{
			rule = 3;
		}
		else if (bestTs === tsWeekOfYear)
		{
			rule = 5;
		}
	}
	else
	{
		rule = 1;
	}
	return rule;
};
oFF.XGregorianCalendar.prototype.getTimeZoneOffsetMillis = function(timeZone)
{
	return timeZone.getRawOffset();
};
oFF.XGregorianCalendar.prototype.getWeekNumber = function(eraDaysToBeginYear, dayOfYear, startDayOfYear)
{
	let firstDayOfWeekPeriodStartAsDayOfYear = this.getFirstDayOfWeekAsDayOfYear(eraDaysToBeginYear, startDayOfYear);
	let weekNumber = oFF.XMath.div(dayOfYear - firstDayOfWeekPeriodStartAsDayOfYear, 7) + 1;
	let minDays = this.getMinimalDaysInFirstWeek();
	let numDaysOfWeekIncludingAndAfterPeriodOfYear = 7 - (startDayOfYear - firstDayOfWeekPeriodStartAsDayOfYear);
	if (numDaysOfWeekIncludingAndAfterPeriodOfYear < minDays)
	{
		weekNumber--;
	}
	return weekNumber;
};
oFF.XGregorianCalendar.prototype.instantiateIsSet = function()
{
	for (let i = 0; i < oFF.DateConstants.FIELD_COUNT; i++)
	{
		this.m_isSet.set(i, oFF.XBooleanValue.create(false));
	}
};
oFF.XGregorianCalendar.prototype.internalSet = function(field, value)
{
	this.m_fields.set(field, value);
};
oFF.XGregorianCalendar.prototype.invalidOrMaxTimeStampThreeFields = function(tsField1, tsField2, tsField3)
{
	let tsField12 = this.invalidOrMaxTimestampTwoFields(tsField1, tsField2);
	return this.invalidOrMaxTimestampTwoFields(tsField12, tsField3);
};
oFF.XGregorianCalendar.prototype.invalidOrMaxTimestampOneField = function(tsField)
{
	return tsField;
};
oFF.XGregorianCalendar.prototype.invalidOrMaxTimestampTwoFields = function(tsField1, tsField2)
{
	if (tsField1 === oFF.XCalendar.TIMESTAMP_INVALID || tsField2 === oFF.XCalendar.TIMESTAMP_INVALID)
	{
		return oFF.XCalendar.TIMESTAMP_INVALID;
	}
	return tsField1 > tsField2 ? tsField1 : tsField2;
};
oFF.XGregorianCalendar.prototype.isLeapYear = function(yearIn)
{
	if (this.isValidGregorianDate(yearIn, 12, 31))
	{
		if (oFF.XMath.mod(yearIn, 400) === 0)
		{
			return true;
		}
		if (oFF.XMath.mod(yearIn, 100) === 0)
		{
			return false;
		}
		return oFF.XMath.mod(yearIn, 4) === 0;
	}
	return true;
};
oFF.XGregorianCalendar.prototype.isValidGregorianDate = function(year, oneBasedMonth, day)
{
	if ((year < 1582 || year > 9999) && year !== 1000)
	{
		return false;
	}
	if (year === 1582)
	{
		if (oneBasedMonth < 10 || oneBasedMonth === 10 && day < 15)
		{
			return false;
		}
	}
	return true;
};
oFF.XGregorianCalendar.prototype.newCalendarDate = function(timeZone)
{
	return oFF.XGregorianCalendarDate.createWithTimeZone(timeZone);
};
oFF.XGregorianCalendar.prototype.rollAmount = function(field, amount)
{
	if (field < 0 || field >= oFF.DateConstants.FIELD_COUNT)
	{
		let firstPartMessage = oFF.XStringUtils.concatenateWithInt("field value", field);
		let secondPartMessage = oFF.XStringUtils.concatenateWithInt(" out of range [0...", oFF.DateConstants.FIELD_COUNT - 1);
		let thirdPartMessage = "]";
		let message = oFF.XStringUtils.concatenate3(firstPartMessage, secondPartMessage, thirdPartMessage);
		throw oFF.XException.createIllegalArgumentException(message);
	}
	if (amount === 0)
	{
		return;
	}
	this.complete();
	if (field === oFF.DateConstants.ERA)
	{
		this.rollField(oFF.DateConstants.ERA, amount);
	}
	else if (field === oFF.DateConstants.YEAR)
	{
		this.rollField(oFF.DateConstants.YEAR, amount);
		this.clampDate();
	}
	else if (field === oFF.DateConstants.MONTH || field === oFF.DateConstants.QUARTER || field === oFF.DateConstants.HALF_YEAR)
	{
		this.rollField(oFF.DateConstants.MONTH, field === oFF.DateConstants.QUARTER ? amount * 3 : field === oFF.DateConstants.HALF_YEAR ? amount * 6 : amount);
		this.clampDate();
		let year = this.internalGet(oFF.DateConstants.YEAR);
		let oneBasedMonth = this.internalGet(oFF.DateConstants.MONTH) + 1;
		let dayOfMonth = this.internalGet(oFF.DateConstants.DAY_OF_MONTH);
		let maxDayOfMonth = this.getDaysInMonth(year, oneBasedMonth);
		if (dayOfMonth > maxDayOfMonth)
		{
			this.setField(oFF.DateConstants.DAY_OF_MONTH, maxDayOfMonth);
		}
	}
	else if (field === oFF.DateConstants.WEEK_OF_YEAR || field === oFF.DateConstants.WEEK_OF_MONTH)
	{
		oFF.noSupport();
	}
	else if (field === oFF.DateConstants.DAY_OF_MONTH)
	{
		this.rollField(oFF.DateConstants.DAY_OF_MONTH, amount);
		this.clampDate();
	}
	else if (field === oFF.DateConstants.DAY_OF_YEAR)
	{
		this.rollField(oFF.DateConstants.DAY_OF_YEAR, amount);
		this.clampDate();
	}
	else if (field === oFF.DateConstants.DAY_OF_WEEK)
	{
		this.rollField(oFF.DateConstants.DAY_OF_WEEK, amount);
		this.clampDate();
	}
	else if (field === oFF.DateConstants.DAY_OF_WEEK_IN_MONTH)
	{
		oFF.noSupport();
	}
	else if (field === oFF.DateConstants.AM_PM)
	{
		this.rollField(oFF.DateConstants.AM_PM, amount);
	}
	else if (field === oFF.DateConstants.HOUR || field === oFF.DateConstants.HOUR_OF_DAY)
	{
		this.rollField(field, amount);
	}
	else if (field === oFF.DateConstants.MINUTE)
	{
		this.rollField(oFF.DateConstants.MINUTE, amount);
	}
	else if (field === oFF.DateConstants.SECOND)
	{
		this.rollField(oFF.DateConstants.SECOND, amount);
	}
	else if (field === oFF.DateConstants.MILLISECOND)
	{
		this.rollField(oFF.DateConstants.MILLISECOND, amount);
	}
	else if (field === oFF.DateConstants.ZONE_OFFSET)
	{
		throw oFF.XException.createIllegalArgumentException("Rolling zone offsets is not supported.");
	}
	else
	{
		throw oFF.XException.createIllegalArgumentException("Rolling DST offsets is not supported.");
	}
};
oFF.XGregorianCalendar.prototype.rollField = function(field, amount)
{
	let minimum = this.getActualMinimum(field);
	let maximum = this.getActualMaximum(field);
	let range = maximum - minimum + 1;
	let oldValue = this.internalGet(field);
	let newValue = oFF.XMath.mod(oldValue - minimum + amount, range);
	if (newValue < 0)
	{
		newValue = newValue + range;
	}
	newValue = newValue + minimum;
	this.setField(field, newValue);
};
oFF.XGregorianCalendar.prototype.rollUnit = function(field, up)
{
	if (field < 0 || field >= oFF.DateConstants.FIELD_COUNT)
	{
		let firstPartMessage = oFF.XStringUtils.concatenateWithInt("field value", field);
		let secondPartMessage = oFF.XStringUtils.concatenateWithInt(" out of range [0...", oFF.DateConstants.FIELD_COUNT - 1);
		let thirdPartMessage = "]";
		let message = oFF.XStringUtils.concatenate3(firstPartMessage, secondPartMessage, thirdPartMessage);
		throw oFF.XException.createIllegalArgumentException(message);
	}
	let amount = up ? +1 : -1;
	this.rollAmount(field, amount);
};
oFF.XGregorianCalendar.prototype.setGregorianChange = function(date)
{
	if (date.getTimeInMilliseconds() !== oFF.XGregorianCalendar.GREGORIAN_CUTOVER_MILLIS)
	{
		oFF.noSupport();
	}
};

oFF.XJapaneseImperialCalendar = function() {};
oFF.XJapaneseImperialCalendar.prototype = new oFF.XCalendar();
oFF.XJapaneseImperialCalendar.prototype._ff_c = "XJapaneseImperialCalendar";

oFF.XJapaneseImperialCalendar.create = function()
{
	return oFF.XJapaneseImperialCalendar.createWithTimeZone(oFF.XSimpleTimeZone.create());
};
oFF.XJapaneseImperialCalendar.createWithTimeZone = function(timeZone)
{
	let instance = new oFF.XJapaneseImperialCalendar();
	instance.m_fields = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	instance.m_isSet = oFF.XArray.create(oFF.DateConstants.FIELD_COUNT);
	instance.m_timestamp = oFF.XGregorianCalendar.createTimestampArray();
	instance.m_isLenient = true;
	instance.m_timeZone = timeZone;
	instance.jcal = oFF.XLocalGregorianCalendar.getLocalGregorianCalendar("japanese");
	instance.m_jdate = instance.jcal.newCalendarDate(timeZone);
	instance.gcal = oFF.XGregorianCalendar.createWithTimeZone(null);
	instance.m_cachedFixedDate = oFF.XLong.getMinimumValue();
	instance.setMinimalDaysInFirstWeek(1);
	return instance;
};
oFF.XJapaneseImperialCalendar.getEraIndex = function(date)
{
	let era = date.getEra();
	for (let i = oFF.DateConstants.JAPANESE_ERAS.size() - 1; i > 0; i--)
	{
		if (oFF.DateConstants.JAPANESE_ERAS.get(i) === era)
		{
			return i;
		}
	}
	return 0;
};
oFF.XJapaneseImperialCalendar.getTransitionEraIndex = function(date)
{
	let eraIndex = oFF.XJapaneseImperialCalendar.getEraIndex(date);
	let transitionDate = oFF.DateConstants.JAPANESE_ERAS.get(eraIndex).getSinceDate();
	if (transitionDate.getYear() === date.getNormalizedYear() && transitionDate.getMonth() === date.getMonth())
	{
		return eraIndex;
	}
	if (eraIndex < oFF.DateConstants.JAPANESE_ERAS.size() - 1)
	{
		transitionDate = oFF.DateConstants.JAPANESE_ERAS.get(eraIndex + 1).getSinceDate();
		if (transitionDate.getYear() === date.getNormalizedYear() && transitionDate.getMonth() === date.getMonth())
		{
			return eraIndex;
		}
	}
	return -1;
};
oFF.XJapaneseImperialCalendar.prototype.gcal = null;
oFF.XJapaneseImperialCalendar.prototype.jcal = null;
oFF.XJapaneseImperialCalendar.prototype.m_cachedFixedDate = 0;
oFF.XJapaneseImperialCalendar.prototype.m_jdate = null;
oFF.XJapaneseImperialCalendar.prototype.add = function(field, amountIn) {};
oFF.XJapaneseImperialCalendar.prototype.computeFields = function()
{
	let timeZone = this.getTimeZone();
	let zoneOffsets = oFF.XArrayOfInt.create(2);
	let zoneOffset = timeZone.getOffsets(this.m_time, zoneOffsets);
	let fixedDate = oFF.XMath.longDiv(zoneOffset, oFF.DateConstants.DAY_IN_MILLIS);
	let timeOfDay = oFF.XMath.mod(zoneOffset, oFF.DateConstants.DAY_IN_MILLIS);
	fixedDate = fixedDate + oFF.XMath.longDiv(this.m_time, oFF.DateConstants.DAY_IN_MILLIS);
	timeOfDay = timeOfDay + oFF.XLong.convertToInt(oFF.XMath.longDiv(this.m_time, oFF.DateConstants.DAY_IN_MILLIS));
	if (timeOfDay >= oFF.DateConstants.DAY_IN_MILLIS)
	{
		timeOfDay = timeOfDay - oFF.DateConstants.DAY_IN_MILLIS;
		fixedDate = fixedDate + 1;
	}
	else
	{
		while (timeOfDay < 0)
		{
			timeOfDay = timeOfDay + oFF.DateConstants.DAY_IN_MILLIS;
			fixedDate = fixedDate - 1;
		}
	}
	fixedDate = fixedDate + oFF.XCalendar.EPOCH_OFFSET;
	if (fixedDate !== this.m_cachedFixedDate || fixedDate < 0)
	{
		this.jcal.getCalendarDateFromDateAndFixedDate(this.m_jdate, fixedDate);
		this.m_cachedFixedDate = fixedDate;
	}
	let era = oFF.XJapaneseImperialCalendar.getEraIndex(this.m_jdate);
	let year = this.m_jdate.getYear();
	this.internalSet(oFF.DateConstants.ERA, era);
	this.internalSet(oFF.DateConstants.YEAR, year);
	let month = this.m_jdate.getMonth();
	let dayOfMonth = this.m_jdate.getDayOfMonth();
	this.internalSet(oFF.DateConstants.MONTH, month);
	this.internalSet(oFF.DateConstants.DAY_OF_MONTH, dayOfMonth);
	this.internalSet(oFF.DateConstants.DAY_OF_WEEK, this.m_jdate.getDayOfWeek());
	if (timeOfDay !== 0)
	{
		let hours = oFF.XMath.div(timeOfDay, oFF.DateConstants.HOUR_IN_MILLIS);
		this.internalSet(oFF.DateConstants.HOUR_OF_DAY, hours);
		this.internalSet(oFF.DateConstants.AM_PM, oFF.XMath.div(hours, 12));
		this.internalSet(oFF.DateConstants.HOUR, oFF.XMath.mod(hours, 12));
		let r = oFF.XMath.mod(timeOfDay, oFF.DateConstants.HOUR_IN_MILLIS);
		this.internalSet(oFF.DateConstants.MINUTE, oFF.XMath.div(r, oFF.DateConstants.MINUTE_IN_MILLIS));
		r = oFF.XMath.mod(r, oFF.DateConstants.MINUTE_IN_MILLIS);
		this.internalSet(oFF.DateConstants.SECOND, oFF.XMath.div(r, oFF.DateConstants.SECOND_IN_MILLIS));
		this.internalSet(oFF.DateConstants.MILLISECOND, oFF.XMath.mod(r, oFF.DateConstants.SECOND_IN_MILLIS));
	}
	else
	{
		this.internalSet(oFF.DateConstants.HOUR_OF_DAY, 0);
		this.internalSet(oFF.DateConstants.AM_PM, oFF.DateConstants.AM);
		this.internalSet(oFF.DateConstants.HOUR, 0);
		this.internalSet(oFF.DateConstants.MINUTE, 0);
		this.internalSet(oFF.DateConstants.SECOND, 0);
		this.internalSet(oFF.DateConstants.MILLISECOND, 0);
	}
	this.internalSet(oFF.DateConstants.ZONE_OFFSET, zoneOffsets.get(0));
	this.internalSet(oFF.DateConstants.DST_OFFSET, zoneOffsets.get(1));
	let normalizedYear = this.m_jdate.getNormalizedYear();
	let transitionYear = this.isTransitionYear(this.m_jdate.getNormalizedYear());
	let dayOfYear;
	let fixedDateJan1;
	if (transitionYear)
	{
		fixedDateJan1 = this.getFixedDateJan1(this.m_jdate, fixedDate);
		dayOfYear = oFF.XLong.convertToInt((fixedDate - fixedDateJan1) + 1);
	}
	else if (normalizedYear === oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.get(oFF.DateConstants.YEAR))
	{
		let dx = this.jcal.getCalendarDateWithMillisAndTimezone(oFF.XLong.getMinimumValue(), this.getTimeZone());
		fixedDateJan1 = this.jcal.getFixedDateWithDate(dx);
		dayOfYear = oFF.XLong.convertToInt((fixedDate - fixedDateJan1) + 1);
	}
	else
	{
		dayOfYear = oFF.XLong.convertToInt(this.jcal.getDayOfYearForDateAsLong(this.m_jdate));
		fixedDateJan1 = fixedDate - dayOfYear + 1;
	}
	let fixedDateMonth1 = transitionYear ? this.getFixedDateMonth1(this.m_jdate, fixedDate) : fixedDateJan1 - dayOfMonth + 1;
	this.internalSet(oFF.DateConstants.DAY_OF_YEAR, dayOfYear);
	this.internalSet(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, oFF.XMath.div(dayOfMonth - 1, 7) + 1);
	let weekOfYear = this.getWeekNumber(fixedDateJan1, fixedDateMonth1);
	if (weekOfYear === 0)
	{
		let fixedDec31 = fixedDateJan1 - 1;
		let prevJan1;
		let d = this.getCalendarDateFromFixedDate(fixedDec31);
		if (!(transitionYear || this.isTransitionYear(d.getNormalizedYear())))
		{
			prevJan1 = fixedDateJan1 - 365;
			if (d.isLeapYear())
			{
				prevJan1 = prevJan1 - 1;
			}
		}
		else if (transitionYear)
		{
			if (this.m_jdate.getYear() === 1)
			{
				if (era > oFF.DateConstants.REIWA)
				{
					let pd = oFF.DateConstants.JAPANESE_ERAS.get(era - 1).getSinceDate();
					if (normalizedYear === pd.getYear())
					{
						d.setMonth(pd.getMonth()).setDayOfMonth(pd.getDayOfMonth());
					}
				}
				else
				{
					d.setMonth(oFF.DateConstants.JANUARY).setDayOfMonth(1);
				}
				this.jcal.normalize(d);
				prevJan1 = this.jcal.getFixedDateWithDate(d);
			}
			else
			{
				prevJan1 = fixedDateJan1 - 365;
				if (d.isLeapYear())
				{
					prevJan1 = prevJan1 - 1;
				}
			}
		}
		else
		{
			let cd = oFF.DateConstants.JAPANESE_ERAS.get(oFF.XJapaneseImperialCalendar.getEraIndex(this.m_jdate)).getSinceDate();
			d.setMonth(cd.getMonth()).setDayOfMonth(cd.getDayOfMonth());
			this.jcal.normalize(d);
			prevJan1 = this.jcal.getFixedDateWithDate(d);
		}
		weekOfYear = this.getWeekNumber(prevJan1, fixedDec31);
	}
	else
	{
		if (!transitionYear)
		{
			if (weekOfYear >= 52)
			{
				let nextJan1 = fixedDateJan1 + 365;
				if (this.m_jdate.isLeapYear())
				{
					nextJan1 = nextJan1 + 1;
				}
				let nextJan1st = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(nextJan1, this.getFirstDayOfWeek());
				let ndays = oFF.XLong.convertToInt(nextJan1st - nextJan1);
				if (ndays >= this.getMinimalDaysInFirstWeek() && fixedDate >= (nextJan1st - 7))
				{
					weekOfYear = 1;
				}
			}
		}
		else
		{
			let d = this.m_jdate.clone();
			let nextJan1;
			if (this.m_jdate.getYear() === 1)
			{
				d.addYear(1);
				d.setMonth(oFF.DateConstants.JANUARY).setDayOfMonth(1);
				nextJan1 = this.jcal.getFixedDateWithDate(d);
			}
			else
			{
				let nextEraIndex = oFF.XJapaneseImperialCalendar.getEraIndex(d) + 1;
				let cd = oFF.DateConstants.JAPANESE_ERAS.get(nextEraIndex).getSinceDate();
				d.setEra(oFF.DateConstants.JAPANESE_ERAS.get(nextEraIndex));
				d.setDate(1, cd.getMonth(), cd.getDayOfMonth());
				this.jcal.normalize(d);
				nextJan1 = this.jcal.getFixedDateWithDate(d);
			}
			let nextJan1st = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(nextJan1, this.getFirstDayOfWeek());
			let ndays = oFF.XLong.convertToInt(nextJan1st - nextJan1);
			if (ndays >= this.getMinimalDaysInFirstWeek() && fixedDate >= (nextJan1st - 7))
			{
				weekOfYear = 1;
			}
		}
	}
	this.internalSet(oFF.DateConstants.WEEK_OF_YEAR, weekOfYear);
	this.internalSet(oFF.DateConstants.WEEK_OF_MONTH, this.getWeekNumber(fixedDateMonth1, fixedDate));
};
oFF.XJapaneseImperialCalendar.prototype.computeTime = function()
{
	if (!this.isLenient())
	{
		this.checkFields();
	}
	let year;
	let era;
	if (this.m_timestamp.get(oFF.DateConstants.ERA) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		era = this.internalGet(oFF.DateConstants.ERA);
		year = (this.m_timestamp.get(oFF.DateConstants.YEAR) !== oFF.XCalendar.TIMESTAMP_INVALID) ? this.internalGet(oFF.DateConstants.YEAR) : 1;
	}
	else
	{
		if (this.m_timestamp.get(oFF.DateConstants.YEAR) !== oFF.XCalendar.TIMESTAMP_INVALID)
		{
			era = oFF.DateConstants.JAPANESE_ERAS.size() - 1;
			year = this.internalGet(oFF.DateConstants.YEAR);
		}
		else
		{
			era = oFF.DateConstants.SHOWA;
			year = 45;
		}
	}
	let timeOfDay = 0;
	if (this.m_timestamp.get(oFF.DateConstants.HOUR_OF_DAY) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		timeOfDay = timeOfDay + this.internalGet(oFF.DateConstants.HOUR_OF_DAY);
	}
	else
	{
		timeOfDay = timeOfDay + this.internalGet(oFF.DateConstants.HOUR);
		if (this.m_timestamp.get(oFF.DateConstants.AM_PM) !== oFF.XCalendar.TIMESTAMP_INVALID)
		{
			timeOfDay = timeOfDay + 12 * this.internalGet(oFF.DateConstants.AM_PM);
		}
	}
	timeOfDay = timeOfDay * 60;
	timeOfDay = timeOfDay + this.internalGet(oFF.DateConstants.MINUTE);
	timeOfDay = timeOfDay * 60;
	timeOfDay = timeOfDay + this.internalGet(oFF.DateConstants.SECOND);
	timeOfDay = timeOfDay * 1000;
	timeOfDay = timeOfDay + this.internalGet(oFF.DateConstants.MILLISECOND);
	let fixedDate = oFF.XMath.longDiv(timeOfDay, oFF.DateConstants.DAY_IN_MILLIS);
	timeOfDay = oFF.XMath.longMod(timeOfDay, oFF.DateConstants.DAY_IN_MILLIS);
	while (timeOfDay < 0)
	{
		timeOfDay = timeOfDay + oFF.DateConstants.DAY_IN_MILLIS;
		fixedDate = fixedDate - 1;
	}
	fixedDate = fixedDate + this.getFixedDateWithEraAndYear(era, year);
	let millis = (fixedDate - oFF.XCalendar.EPOCH_OFFSET) * oFF.DateConstants.DAY_IN_MILLIS + timeOfDay;
	let timeZone = this.getTimeZone();
	let timeZoneOffsetMillis = 0;
	if (this.m_timestamp.get(oFF.DateConstants.ZONE_OFFSET) >= oFF.XCalendar.TIMESTAMP_INVALID)
	{
		timeZoneOffsetMillis = this.internalGet(oFF.DateConstants.ZONE_OFFSET);
	}
	else
	{
		timeZoneOffsetMillis = this.getTimeZoneOffsetMillis(timeZone);
	}
	millis = millis - timeZoneOffsetMillis;
	let daylightSavingTimeOffsetMillis = 0;
	if (this.m_timestamp.get(oFF.DateConstants.DST_OFFSET) >= oFF.XCalendar.TIMESTAMP_MINIMUM)
	{
		daylightSavingTimeOffsetMillis = this.internalGet(oFF.DateConstants.DST_OFFSET);
	}
	else
	{
		daylightSavingTimeOffsetMillis = this.getDaylightSavingTimeOffsetMillis(timeZone, millis);
	}
	let isDSTNow = this.getDaylightSavingTimeOffsetMillis(timeZone, millis) !== 0;
	let isDSTOneHourAgo = this.getDaylightSavingTimeOffsetMillis(timeZone, millis - oFF.DateConstants.HOUR_IN_MILLIS) !== 0;
	let enterDST = isDSTNow && !isDSTOneHourAgo;
	if (enterDST)
	{
		daylightSavingTimeOffsetMillis = 0;
	}
	millis = millis - daylightSavingTimeOffsetMillis;
	this.m_time = millis;
};
oFF.XJapaneseImperialCalendar.prototype.getCalendarDateFromFixedDate = function(fd)
{
	let d = this.jcal.newCalendarDate(oFF.XSimpleTimeZone.create());
	this.jcal.getCalendarDateFromDateAndFixedDate(d, fd);
	return d;
};
oFF.XJapaneseImperialCalendar.prototype.getDaylightSavingTimeOffsetMillis = function(timeZone, millis)
{
	let offsetMillis = 0;
	if (timeZone.inDaylightTime(oFF.XDateTime.createWithMilliseconds(millis)))
	{
		offsetMillis = timeZone.getDSTSavings();
	}
	return offsetMillis;
};
oFF.XJapaneseImperialCalendar.prototype.getDaysInMonth = function(year, onBasedMonth)
{
	return 0;
};
oFF.XJapaneseImperialCalendar.prototype.getFixedDateJan1 = function(date, fixedDate)
{
	let era = date.getEra();
	let d;
	if (oFF.notNull(era) && date.getYear() === 1)
	{
		for (let eraIndex = oFF.XJapaneseImperialCalendar.getEraIndex(date); eraIndex > 0; eraIndex--)
		{
			d = oFF.DateConstants.JAPANESE_ERAS.get(eraIndex).getSinceDate();
			let fd = this.gcal.getFixedDateWithDate(d);
			if (fd > fixedDate)
			{
				continue;
			}
			return fd;
		}
	}
	d = this.gcal.newCalendarDate(null);
	d.setDate(date.getNormalizedYear(), oFF.DateConstants.JANUARY, 1);
	return this.gcal.getFixedDateWithDate(d);
};
oFF.XJapaneseImperialCalendar.prototype.getFixedDateMonth1 = function(date, fixedDate)
{
	let eraIndex = oFF.XJapaneseImperialCalendar.getTransitionEraIndex(date);
	if (eraIndex !== -1)
	{
		let transition = this.gcal.getFixedDateWithDate(oFF.DateConstants.JAPANESE_ERAS.get(eraIndex).getSinceDate());
		if (transition <= fixedDate)
		{
			return transition;
		}
	}
	return fixedDate - date.getDayOfMonth() + 1;
};
oFF.XJapaneseImperialCalendar.prototype.getFixedDateWithEraAndYear = function(era, yearIn)
{
	let year = yearIn;
	let month = oFF.DateConstants.JANUARY;
	let firstDayOfMonth = 1;
	if (this.m_timestamp.get(oFF.DateConstants.MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		month = this.internalGet(oFF.DateConstants.MONTH);
		if (month > oFF.DateConstants.DECEMBER)
		{
			year = year + (oFF.XMath.div(month, 12));
			month = oFF.XMath.mod(month, 12);
		}
		else if (month < oFF.DateConstants.JANUARY)
		{
			year = year + oFF.XAbstractCalendarDate.floorDivide(month, 12);
			month = oFF.XAbstractCalendarDate.modFloor(month, 12);
		}
	}
	else
	{
		if (year === 1 && era !== 0)
		{
			let sinceDate = oFF.DateConstants.JAPANESE_ERAS.get(era).getSinceDate();
			month = sinceDate.getMonth();
			firstDayOfMonth = sinceDate.getDayOfMonth();
		}
	}
	if (year === oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.get(oFF.DateConstants.YEAR))
	{
		let dx = this.jcal.getCalendarDateWithMillisAndTimezone(oFF.XLong.getMinimumValue(), this.getTimeZone());
		let m = dx.getMonth();
		if (month < m)
		{
			month = m;
		}
		if (month === m)
		{
			firstDayOfMonth = dx.getDayOfMonth();
		}
	}
	let date = this.jcal.newCalendarDate(null);
	date.setEra(era >= 0 ? oFF.DateConstants.JAPANESE_ERAS.get(era) : null);
	date.setDate(year, month, firstDayOfMonth);
	this.jcal.normalize(date);
	let fixedDate = this.jcal.getFixedDateWithDate(date);
	if (this.m_timestamp.get(oFF.DateConstants.MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
	{
		if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
		{
			if (this.m_isSet.get(oFF.DateConstants.DAY_OF_MONTH).getBoolean())
			{
				fixedDate = fixedDate + this.internalGet(oFF.DateConstants.DAY_OF_MONTH);
				fixedDate = fixedDate - firstDayOfMonth;
			}
		}
		else
		{
			if (this.m_timestamp.get(oFF.DateConstants.WEEK_OF_MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
			{
				let firsDayOfWeek = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(fixedDate + 6, this.getFirstDayOfWeek());
				if ((firsDayOfWeek - fixedDate) >= this.getMinimalDaysInFirstWeek())
				{
					firsDayOfWeek = firstDayOfMonth - 7;
				}
				if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK) !== oFF.XCalendar.TIMESTAMP_INVALID)
				{
					firsDayOfWeek = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(fixedDate + 6, this.internalGet(oFF.DateConstants.DAY_OF_WEEK));
				}
				fixedDate = firsDayOfWeek + 7 * (this.internalGet(oFF.DateConstants.DAY_OF_MONTH) - 1);
			}
			else
			{
				let dayOfWeek;
				if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK) !== oFF.XCalendar.TIMESTAMP_INVALID)
				{
					dayOfWeek = this.internalGet(oFF.DateConstants.DAY_OF_WEEK);
				}
				else
				{
					dayOfWeek = this.getFirstDayOfWeek();
				}
				let dowim;
				if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH) !== oFF.XCalendar.TIMESTAMP_INVALID)
				{
					dowim = this.internalGet(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH);
				}
				else
				{
					dowim = 1;
				}
				if (dowim >= 0)
				{
					fixedDate = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(fixedDate + (7 * dowim) - 1, dayOfWeek);
				}
				else
				{
					let lastDate = this.monthLength(month, year) + (7 * (dowim + 1));
					fixedDate = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(fixedDate + lastDate - 1, dayOfWeek);
				}
			}
		}
	}
	else
	{
		if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_YEAR) !== oFF.XCalendar.TIMESTAMP_INVALID)
		{
			if (this.isTransitionYear(date.getYear()))
			{
				fixedDate = this.getFixedDateJan1(date, fixedDate);
			}
			fixedDate = fixedDate + this.internalGet(oFF.DateConstants.DAY_OF_YEAR);
			fixedDate = fixedDate - 1;
		}
		else
		{
			let firstDayOfWeek = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(fixedDate + 6, this.getFirstDayOfWeek());
			if ((firstDayOfWeek - fixedDate) >= this.getMinimalDaysInFirstWeek())
			{
				firstDayOfWeek = firstDayOfWeek - 7;
			}
			if (this.m_timestamp.get(oFF.DateConstants.DAY_OF_WEEK) !== oFF.XCalendar.TIMESTAMP_INVALID)
			{
				let dayOfWeek = this.internalGet(oFF.DateConstants.DAY_OF_WEEK);
				if (dayOfWeek !== this.getFirstDayOfWeek())
				{
					firstDayOfWeek = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(firstDayOfWeek + 6, dayOfWeek);
				}
			}
			fixedDate = firstDayOfWeek + (7 * this.internalGet(oFF.DateConstants.WEEK_OF_YEAR) - 1);
		}
	}
	return fixedDate;
};
oFF.XJapaneseImperialCalendar.prototype.getGreatestMinimum = function(field)
{
	return 0;
};
oFF.XJapaneseImperialCalendar.prototype.getLeastMaximum = function(field)
{
	return 0;
};
oFF.XJapaneseImperialCalendar.prototype.getMaximum = function(field)
{
	return 0;
};
oFF.XJapaneseImperialCalendar.prototype.getMinimum = function(field)
{
	return 0;
};
oFF.XJapaneseImperialCalendar.prototype.getTimeZoneOffsetMillis = function(timeZone)
{
	return timeZone.getRawOffset();
};
oFF.XJapaneseImperialCalendar.prototype.getWeekNumber = function(fixedDay1, fixedDate)
{
	let fixedDay1st = oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore(fixedDay1 + 6, this.getFirstDayOfWeek());
	let ndays = oFF.XLong.convertToInt(fixedDay1st - fixedDay1);
	oFF.XObjectExt.assertTrue(ndays <= 7);
	if (ndays >= this.getMinimalDaysInFirstWeek())
	{
		fixedDay1st = fixedDay1st - 7;
	}
	let normalizedDayOfPeriod = oFF.XLong.convertToInt(fixedDate - fixedDay1st);
	if (normalizedDayOfPeriod >= 0)
	{
		return oFF.XMath.div(normalizedDayOfPeriod, 7) + 1;
	}
	return oFF.XAbstractCalendarDate.floorDivide(normalizedDayOfPeriod, 7) + 1;
};
oFF.XJapaneseImperialCalendar.prototype.internalSet = function(field, value)
{
	this.m_fields.set(field, value);
};
oFF.XJapaneseImperialCalendar.prototype.isLeapYear = function(yearIn)
{
	return false;
};
oFF.XJapaneseImperialCalendar.prototype.isTransitionYear = function(normalizedYear)
{
	for (let i = oFF.DateConstants.JAPANESE_ERAS.size() - 1; i > 0; i--)
	{
		let transitionYear = oFF.DateConstants.JAPANESE_ERAS.get(i).getSinceDate().getYear();
		if (normalizedYear === transitionYear)
		{
			return true;
		}
	}
	return false;
};
oFF.XJapaneseImperialCalendar.prototype.monthLength = function(month, year)
{
	return oFF.XCalendarUtils.isGregorianLeapYear(year) ? oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.get(month - 1) : oFF.DateConstants.DAYS_IN_MONTH.get(month - 1);
};
oFF.XJapaneseImperialCalendar.prototype.newCalendarDate = function(timeZone)
{
	return null;
};
oFF.XJapaneseImperialCalendar.prototype.rollAmount = function(field, amount) {};
oFF.XJapaneseImperialCalendar.prototype.rollUnit = function(field, up) {};

oFF.XSimpleTimeZone = function() {};
oFF.XSimpleTimeZone.prototype = new oFF.XTimeZone();
oFF.XSimpleTimeZone.prototype._ff_c = "XSimpleTimeZone";

oFF.XSimpleTimeZone.DOM_MODE = 1;
oFF.XSimpleTimeZone.DOW_GE_DOM_MODE = 3;
oFF.XSimpleTimeZone.DOW_IN_MONTH_MODE = 2;
oFF.XSimpleTimeZone.DOW_LE_DOM_MODE = 4;
oFF.XSimpleTimeZone.STANDARD_TIME = 1;
oFF.XSimpleTimeZone.UTC_TIME = 2;
oFF.XSimpleTimeZone.WALL_TIME = 0;
oFF.XSimpleTimeZone.create = function()
{
	let instance = oFF.XSimpleTimeZone.createWithOffsetAndId(0, oFF.XTimeZone.GMT_ID);
	instance.setDaysInMonth();
	return instance;
};
oFF.XSimpleTimeZone.createFromIsoFormat = function(dateTime)
{
	let timeZone = null;
	if (oFF.XString.size(dateTime) > 19 && (oFF.XString.isEqual(oFF.XString.substring(dateTime, 19, 20), "+") || oFF.XString.isEqual(oFF.XString.substring(dateTime, 19, 20), "-")))
	{
		let hoursString = oFF.XString.substring(dateTime, 20, 22);
		let minutesString = oFF.XString.substring(dateTime, 23, 25);
		let hours = oFF.XInteger.convertFromString(hoursString);
		let minutes = oFF.XInteger.convertFromString(minutesString);
		let timezoneOffset = hours * oFF.DateConstants.HOUR_IN_MILLIS + minutes * oFF.DateConstants.MINUTE_IN_MILLIS;
		if (oFF.XString.isEqual(oFF.XString.substring(dateTime, 19, 20), "-"))
		{
			timezoneOffset = -1 * timezoneOffset;
		}
		timeZone = oFF.XSimpleTimeZone.createWithOffsetAndId(timezoneOffset, "");
	}
	return timeZone;
};
oFF.XSimpleTimeZone.createWithFields = function(rawOffset, timeZoneId, startMonth, startDay, startDayOfWeek, startTime, endMonth, endDay, endDayOfWeek, endTime, dstSavings)
{
	let instance = oFF.XSimpleTimeZone.create();
	instance.setTimeZoneId(timeZoneId);
	instance.m_rawOffset = rawOffset;
	instance.m_startMonth = startMonth;
	instance.m_startDay = startDay;
	instance.m_startDayOfWeek = startDayOfWeek;
	instance.m_startTime = startTime;
	instance.m_endMonth = endMonth;
	instance.m_endDay = endDay;
	instance.m_endDayOfWeek = endDayOfWeek;
	instance.m_endTime = endTime;
	instance.m_dstSavings = dstSavings;
	return instance;
};
oFF.XSimpleTimeZone.createWithId = function(timeZoneId)
{
	return oFF.TimeZonesConstants.getTimezone(timeZoneId);
};
oFF.XSimpleTimeZone.createWithOffsetAndId = function(rawOffset, timeZoneId)
{
	let instance = new oFF.XSimpleTimeZone();
	instance.m_rawOffset = rawOffset;
	instance.m_useDaylight = false;
	instance.setTimeZoneId(timeZoneId);
	return instance;
};
oFF.XSimpleTimeZone.createWithUTCMode = function(rawOffset, timeZoneId, startMonth, startDay, startDayOfWeek, startTime, endMonth, endDay, endDayOfWeek, endTime, dstSavings)
{
	let instance = oFF.XSimpleTimeZone.createWithFields(rawOffset, timeZoneId, startMonth, startDay, startDayOfWeek, startTime, endMonth, endDay, endDayOfWeek, endTime, dstSavings);
	instance.m_startTimeMode = oFF.XSimpleTimeZone.UTC_TIME;
	instance.m_endTimeMode = oFF.XSimpleTimeZone.UTC_TIME;
	instance.decodeRules();
	return instance;
};
oFF.XSimpleTimeZone.createWithoutMode = function(rawOffset, timeZoneId, startMonth, startDay, startDayOfWeek, startTime, endMonth, endDay, endDayOfWeek, endTime, dstSavings)
{
	let instance = oFF.XSimpleTimeZone.createWithFields(rawOffset, timeZoneId, startMonth, startDay, startDayOfWeek, startTime, endMonth, endDay, endDayOfWeek, endTime, dstSavings);
	instance.m_startTimeMode = oFF.XSimpleTimeZone.WALL_TIME;
	instance.m_endTimeMode = oFF.XSimpleTimeZone.WALL_TIME;
	instance.decodeRules();
	return instance;
};
oFF.XSimpleTimeZone.prototype.m_daysInMonth = null;
oFF.XSimpleTimeZone.prototype.m_dstSavings = 0;
oFF.XSimpleTimeZone.prototype.m_endDay = 0;
oFF.XSimpleTimeZone.prototype.m_endDayOfWeek = 0;
oFF.XSimpleTimeZone.prototype.m_endMode = 0;
oFF.XSimpleTimeZone.prototype.m_endMonth = 0;
oFF.XSimpleTimeZone.prototype.m_endTime = 0;
oFF.XSimpleTimeZone.prototype.m_endTimeMode = 0;
oFF.XSimpleTimeZone.prototype.m_rawOffset = 0;
oFF.XSimpleTimeZone.prototype.m_startDay = 0;
oFF.XSimpleTimeZone.prototype.m_startDayOfWeek = 0;
oFF.XSimpleTimeZone.prototype.m_startMode = 0;
oFF.XSimpleTimeZone.prototype.m_startMonth = 0;
oFF.XSimpleTimeZone.prototype.m_startTime = 0;
oFF.XSimpleTimeZone.prototype.m_startTimeMode = 0;
oFF.XSimpleTimeZone.prototype.m_startYear = 0;
oFF.XSimpleTimeZone.prototype.m_useDaylight = false;
oFF.XSimpleTimeZone.prototype.decodeEndRule = function()
{
	this.m_useDaylight = this.m_startDay !== 0 && this.m_endDay !== 0;
	if (this.m_endDay !== 0)
	{
		if (this.m_endMonth < oFF.DateConstants.JANUARY || this.m_endMonth > oFF.DateConstants.DECEMBER)
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal end month ", this.m_endMonth));
		}
		if (this.m_endTime < 0 || this.m_endTime > oFF.DateConstants.DAY_IN_MILLIS)
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal end time ", this.m_endTime));
		}
		if (this.m_endDayOfWeek === 0)
		{
			this.m_endMode = oFF.XSimpleTimeZone.DOM_MODE;
		}
		else
		{
			if (this.m_endDayOfWeek > 0)
			{
				this.m_endMode = oFF.XSimpleTimeZone.DOW_IN_MONTH_MODE;
			}
			else
			{
				this.m_endDayOfWeek = 1 - this.m_endDayOfWeek;
				if (this.m_endDay > 0)
				{
					this.m_endMode = oFF.XSimpleTimeZone.DOW_GE_DOM_MODE;
				}
				else
				{
					this.m_endDay = 1 - this.m_endDay;
					this.m_endMode = oFF.XSimpleTimeZone.DOW_LE_DOM_MODE;
				}
			}
			if (this.m_endDayOfWeek > oFF.DateConstants.SATURDAY)
			{
				throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal end day of week ", this.m_endDayOfWeek));
			}
		}
		if (this.m_endMode === oFF.XSimpleTimeZone.DOW_IN_MONTH_MODE)
		{
			if (this.m_endDay < -5 || this.m_endDay > 5)
			{
				throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal end day of week in month ", this.m_endDay));
			}
		}
		else if (this.m_endDay < 1 || this.m_endDay > this.getMonthLength(this.m_endMonth))
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal end day ", this.m_endDay));
		}
	}
};
oFF.XSimpleTimeZone.prototype.decodeRules = function()
{
	this.decodeStartRule();
	this.decodeEndRule();
};
oFF.XSimpleTimeZone.prototype.decodeStartRule = function()
{
	this.m_useDaylight = this.m_startDay !== 0 && this.m_endDay !== 0;
	if (this.m_startDay !== 0)
	{
		if (this.m_startMonth < oFF.DateConstants.JANUARY || this.m_startMonth > oFF.DateConstants.DECEMBER)
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal start month ", this.m_startMonth));
		}
		if (this.m_startTime < 0 || this.m_startTime > oFF.DateConstants.DAY_IN_MILLIS)
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal start time ", this.m_startTime));
		}
		if (this.m_startDayOfWeek === 0)
		{
			this.m_startMode = oFF.XSimpleTimeZone.DOM_MODE;
		}
		else
		{
			if (this.m_startDayOfWeek > 0)
			{
				this.m_startMode = oFF.XSimpleTimeZone.DOW_IN_MONTH_MODE;
			}
			else
			{
				this.m_startDayOfWeek = 1 - this.m_startDayOfWeek;
				if (this.m_startDay > 0)
				{
					this.m_startMode = oFF.XSimpleTimeZone.DOW_GE_DOM_MODE;
				}
				else
				{
					this.m_startDay = 1 - this.m_startDay;
					this.m_startMode = oFF.XSimpleTimeZone.DOW_LE_DOM_MODE;
				}
			}
			if (this.m_startDayOfWeek > oFF.DateConstants.SATURDAY)
			{
				throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal start day of week ", this.m_startDayOfWeek));
			}
		}
		if (this.m_startMode === oFF.XSimpleTimeZone.DOW_IN_MONTH_MODE)
		{
			if (this.m_startDay < -5 || this.m_startDay > 5)
			{
				throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal start day of week in month ", this.m_startDay));
			}
		}
		else if (this.m_startDay < 1 || this.m_startDay > this.getMonthLength(this.m_startMonth))
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenateWithInt("Illegal start day ", this.m_startDay));
		}
	}
};
oFF.XSimpleTimeZone.prototype.getEnd = function(date, year)
{
	let time = this.m_endTime;
	if (this.m_endTimeMode !== oFF.XSimpleTimeZone.UTC_TIME)
	{
		time = time - this.m_rawOffset;
	}
	if (this.m_endTimeMode === oFF.XSimpleTimeZone.WALL_TIME)
	{
		time = time - this.m_dstSavings;
	}
	return this.getTransition(date, this.m_endMode, year, this.m_endMonth, this.m_endDay, this.m_endDayOfWeek, time);
};
oFF.XSimpleTimeZone.prototype.getMonthLength = function(month)
{
	return this.m_daysInMonth.get(month);
};
oFF.XSimpleTimeZone.prototype.getOffset = function(date)
{
	return this.getOffsets(date, null);
};
oFF.XSimpleTimeZone.prototype.getOffsetEraYearMonthDayDayOfWeekMilliseconds = function(era, year, day, dayOfWeek, milliseconds)
{
	return 0;
};
oFF.XSimpleTimeZone.prototype.getOffsetWithDateYearTime = function(date, year, time)
{
	let start = this.getStart(date, year);
	let end = this.getEnd(date, year);
	let offset = this.m_rawOffset;
	if (start <= end)
	{
		if (time >= start && time < end)
		{
			offset = offset + this.m_dstSavings;
		}
	}
	else
	{
		if (time < end)
		{
			start = this.getStart(date, year - 1);
			if (time >= start)
			{
				offset = offset + this.m_dstSavings;
			}
		}
		else if (time >= start)
		{
			end = this.getEnd(date, year + 1);
			if (time < end)
			{
				offset = offset + this.m_dstSavings;
			}
		}
	}
	return offset;
};
oFF.XSimpleTimeZone.prototype.getOffsets = function(date, offsets)
{
	let offset = this.m_rawOffset;
	if (this.m_useDaylight)
	{
		let dateObject = oFF.XDateTime.createWithMilliseconds(date + this.m_rawOffset);
		dateObject.setTimeZone(null);
		let year = dateObject.getYear();
		if (year >= this.m_startYear)
		{
			dateObject.setTimeOfDay(0, 0, 0, 0);
			offset = this.getOffsetWithDateYearTime(dateObject, year, date);
		}
	}
	if (oFF.notNull(offsets))
	{
		offsets.set(0, this.m_rawOffset);
		offsets.set(1, offset - this.m_rawOffset);
	}
	return offset;
};
oFF.XSimpleTimeZone.prototype.getRawOffset = function()
{
	return this.m_rawOffset;
};
oFF.XSimpleTimeZone.prototype.getStart = function(date, year)
{
	let time = this.m_startTime;
	if (this.m_startTimeMode !== oFF.XSimpleTimeZone.UTC_TIME)
	{
		time = time - this.m_rawOffset;
	}
	return this.getTransition(date, this.m_startMode, year, this.m_startMonth, this.m_startDay, this.m_startDayOfWeek, time);
};
oFF.XSimpleTimeZone.prototype.getTransition = function(date, mode, year, month, dayOfMonth, dayOfWeek, timeOfDay)
{
	date.setYear(year);
	date.setMonthOfYear(month);
	if (mode === oFF.XSimpleTimeZone.DOM_MODE)
	{
		date.setDayOfMonth(dayOfMonth);
	}
	else if (mode === oFF.XSimpleTimeZone.DOW_IN_MONTH_MODE)
	{
		date.setDayOfMonth(1);
		if (dayOfMonth < 0)
		{
			date.setDayOfMonth(date.getMonthLength());
		}
		date.setNthDayOfWeek(dayOfMonth, dayOfWeek);
	}
	else if (mode === oFF.XSimpleTimeZone.DOW_GE_DOM_MODE)
	{
		date.setDayOfMonth(dayOfMonth);
		date.setNthDayOfWeek(1, dayOfWeek);
	}
	else if (mode === oFF.XSimpleTimeZone.DOW_LE_DOM_MODE)
	{
		date.setDayOfMonth(dayOfMonth);
		date.setNthDayOfWeek(-1, dayOfWeek);
	}
	return date.getTimeInMilliseconds() + timeOfDay;
};
oFF.XSimpleTimeZone.prototype.hasSameRules = function(other)
{
	let isRawOffsetEqual = this.m_rawOffset === other.m_rawOffset;
	let isUseDaylightEqual = this.m_useDaylight === other.m_useDaylight;
	let isDstSavingsEqual = this.m_dstSavings === other.m_dstSavings;
	let isStartModeEqual = this.m_startMode === other.m_startMode;
	let isStartMonthEqual = this.m_startMonth === other.m_startMonth;
	let isStartDayEqual = this.m_startDay === other.m_startDay;
	let isStartDayOfWeekEqual = this.m_startDayOfWeek === other.m_startDayOfWeek;
	let isStartTimeEqual = this.m_startTime === other.m_startTime;
	let isStartTimeModeEqual = this.m_startTimeMode === other.m_startTimeMode;
	let isEndModeEqual = this.m_endMode === other.m_endMode;
	let isEndMothEqual = this.m_endMonth === other.m_endMonth;
	let isEndDayEqual = this.m_endDay === other.m_endDay;
	let isEndDayOfWeekEqual = this.m_endDayOfWeek === other.m_endDayOfWeek;
	let isEndTimeEqual = this.m_endTime === other.m_endTime;
	let isEndTimeModeEqual = this.m_endTimeMode === other.m_endTimeMode;
	let isStartYearEqual = this.m_startYear === other.m_startYear;
	let areDstFieldsEqual = isDstSavingsEqual && isStartModeEqual && isStartMonthEqual && isStartDayEqual && isStartDayOfWeekEqual && isStartTimeEqual && isStartTimeModeEqual && isEndModeEqual && isEndMothEqual && isEndDayEqual && isEndDayOfWeekEqual && isEndTimeEqual && isEndTimeModeEqual && isStartYearEqual;
	return isRawOffsetEqual && isUseDaylightEqual && (!this.m_useDaylight || areDstFieldsEqual);
};
oFF.XSimpleTimeZone.prototype.inDaylightTime = function(date)
{
	return this.getOffset(date.getTimeInMilliseconds()) !== this.m_rawOffset;
};
oFF.XSimpleTimeZone.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let xOther = other;
	return this.hasSameRules(xOther);
};
oFF.XSimpleTimeZone.prototype.setDaysInMonth = function()
{
	this.m_daysInMonth = oFF.XArrayOfInt.create(12);
	this.m_daysInMonth.set(0, 31);
	this.m_daysInMonth.set(1, 28);
	this.m_daysInMonth.set(2, 31);
	this.m_daysInMonth.set(3, 30);
	this.m_daysInMonth.set(4, 31);
	this.m_daysInMonth.set(5, 30);
	this.m_daysInMonth.set(6, 31);
	this.m_daysInMonth.set(7, 31);
	this.m_daysInMonth.set(8, 30);
	this.m_daysInMonth.set(9, 31);
	this.m_daysInMonth.set(10, 30);
	this.m_daysInMonth.set(11, 31);
};
oFF.XSimpleTimeZone.prototype.setRawOffset = function(offsetMillis)
{
	this.m_rawOffset = offsetMillis;
};
oFF.XSimpleTimeZone.prototype.useDaylightTime = function()
{
	return this.m_useDaylight;
};

oFF.XLocalGregorianCalendar = function() {};
oFF.XLocalGregorianCalendar.prototype = new oFF.XCalendar();
oFF.XLocalGregorianCalendar.prototype._ff_c = "XLocalGregorianCalendar";

oFF.XLocalGregorianCalendar.getDayOfWeekDateOnOrBefore = function(fixedDate, dayOfWeek)
{
	let fd = fixedDate - (dayOfWeek - 1);
	if (fd >= 0)
	{
		return fixedDate - oFF.XMath.longMod(fd, 7);
	}
	return fixedDate - oFF.XAbstractCalendarDate.longModFloor(fd, 7);
};
oFF.XLocalGregorianCalendar.getLocalGregorianCalendar = function(name)
{
	if (!oFF.XString.isEqual("japanese", name))
	{
		return null;
	}
	let instance = new oFF.XLocalGregorianCalendar();
	instance.m_eras = oFF.DateConstants.JAPANESE_ERAS.createArrayCopy();
	return instance;
};
oFF.XLocalGregorianCalendar.prototype.m_eras = null;
oFF.XLocalGregorianCalendar.prototype.add = function(field, amountIn) {};
oFF.XLocalGregorianCalendar.prototype.adjustYear = function(ldate, millis, zoneOffset)
{
	let i;
	for (i = this.m_eras.size() - 1; i >= 0; --i)
	{
		let era = this.m_eras.get(i);
		let since = era.getSince(null);
		if (era.isLocalTime())
		{
			since = since - zoneOffset;
		}
		if (millis >= since)
		{
			ldate.setLocalEra(era);
			let y = ldate.getNormalizedYear() - era.getSinceDate().getYear() + 1;
			ldate.setLocalYear(y);
			break;
		}
	}
	if (i < 0)
	{
		ldate.setLocalEra(null);
		ldate.setLocalYear(ldate.getNormalizedYear());
	}
	ldate.setNormalized(true);
	return ldate;
};
oFF.XLocalGregorianCalendar.prototype.computeFields = function() {};
oFF.XLocalGregorianCalendar.prototype.computeTime = function() {};
oFF.XLocalGregorianCalendar.prototype.getCalendarDate = function(millis, calendarDate)
{
	let ldate = oFF.XCalendar.prototype.getCalendarDate.call( this , millis, calendarDate);
	return this.adjustYear(ldate, millis, ldate.getZoneOffset());
};
oFF.XLocalGregorianCalendar.prototype.getCalendarDateFromDateAndFixedDate = function(date, fixedDate)
{
	let ldate = date;
	oFF.XCalendar.prototype.getCalendarDateFromDateAndFixedDate.call( this , ldate, fixedDate);
	this.adjustYear(ldate, (fixedDate - oFF.XCalendar.EPOCH_OFFSET) * oFF.DateConstants.DAY_IN_MILLIS, 0);
};
oFF.XLocalGregorianCalendar.prototype.getCalendarDateWithMillisAndTimezone = function(millis, zone)
{
	return this.getCalendarDate(millis, this.newCalendarDate(zone));
};
oFF.XLocalGregorianCalendar.prototype.getDaysInMonth = function(year, onBasedMonth)
{
	let daysInMonth = oFF.DateConstants.DAYS_IN_MONTH.get(onBasedMonth - 1);
	if (onBasedMonth === oFF.DateConstants.FEBRUARY && this.isLeapYear(year))
	{
		daysInMonth++;
	}
	return daysInMonth;
};
oFF.XLocalGregorianCalendar.prototype.getGreatestMinimum = function(field)
{
	return 0;
};
oFF.XLocalGregorianCalendar.prototype.getLeastMaximum = function(field)
{
	return 0;
};
oFF.XLocalGregorianCalendar.prototype.getMaximum = function(field)
{
	return 0;
};
oFF.XLocalGregorianCalendar.prototype.getMinimum = function(field)
{
	return 0;
};
oFF.XLocalGregorianCalendar.prototype.isLeapYear = function(yearIn)
{
	return oFF.XCalendar.isGregorianLeapYear(yearIn);
};
oFF.XLocalGregorianCalendar.prototype.isLeapYearWithEra = function(era, year)
{
	if (oFF.isNull(era))
	{
		return this.isLeapYear(year);
	}
	let gyear = era.getSinceDate().getYear() + year - 1;
	return this.isLeapYear(gyear);
};
oFF.XLocalGregorianCalendar.prototype.newCalendarDate = function(timeZone)
{
	return oFF.XLocalGregorianCalendarDate.createWithTimeZone(timeZone);
};
oFF.XLocalGregorianCalendar.prototype.normalize = function(calendarDate)
{
	if (calendarDate.isNormalized())
	{
		return true;
	}
	this.normalizeYear(calendarDate);
	let lDate = calendarDate;
	oFF.XCalendar.prototype.normalize.call( this , lDate);
	let hasMillis = false;
	let millis = 0;
	let year = lDate.getNormalizedYear();
	let i;
	let era = null;
	for (i = this.m_eras.size() - 1; i >= 0; --i)
	{
		era = this.m_eras.get(i);
		if (era.isLocalTime())
		{
			let sinceDate = era.getSinceDate();
			let sinceYear = sinceDate.getYear();
			if (year > sinceYear)
			{
				break;
			}
			if (year === sinceYear)
			{
				let month = lDate.getMonth();
				let sinceMonth = sinceDate.getMonth();
				if (month > sinceMonth)
				{
					break;
				}
				if (month === sinceMonth)
				{
					let day = lDate.getDayOfMonth();
					let sinceDay = sinceDate.getDayOfMonth();
					if (day > sinceDay)
					{
						break;
					}
					if (day === sinceDay)
					{
						let timeOfDay = lDate.getTimeOfDay();
						let sinceTimeOfDay = sinceDate.getTimeOfDay();
						if (timeOfDay >= sinceTimeOfDay)
						{
							break;
						}
						i = i - 1;
						break;
					}
				}
			}
		}
		else
		{
			if (!hasMillis)
			{
				millis = oFF.XCalendar.prototype.getTime.call( this , calendarDate);
				hasMillis = true;
			}
			let since = era.getSince(calendarDate.getZone());
			if (millis >= since)
			{
				break;
			}
		}
	}
	if (i >= 0)
	{
		lDate.setLocalEra(era);
		let y = lDate.getNormalizedYear() - era.getSinceDate().getYear() + 1;
		lDate.setLocalYear(y);
	}
	else
	{
		lDate.setEra(null);
		lDate.setLocalYear(year);
		lDate.setNormalizedYear(year);
	}
	lDate.setNormalized(true);
	return true;
};
oFF.XLocalGregorianCalendar.prototype.normalizeYear = function(date)
{
	let ldate = date;
	let era = ldate.getEra();
	if (oFF.isNull(era) || !this.validateEra(era))
	{
		ldate.setNormalizedYear(ldate.getYear());
	}
	else
	{
		ldate.setNormalizedYear(era.getSinceDate().getYear() + ldate.getYear() - 1);
	}
};
oFF.XLocalGregorianCalendar.prototype.rollAmount = function(field, amount) {};
oFF.XLocalGregorianCalendar.prototype.rollUnit = function(field, up) {};
oFF.XLocalGregorianCalendar.prototype.validateEra = function(era)
{
	for (let i = 0; i < this.m_eras.size(); i++)
	{
		if (era === this.m_eras.get(i))
		{
			return true;
		}
	}
	return false;
};

oFF.XNumberFormatterSettingsFactoryImpl = function() {};
oFF.XNumberFormatterSettingsFactoryImpl.prototype = new oFF.XNumberFormatterSettingsFactory();
oFF.XNumberFormatterSettingsFactoryImpl.prototype._ff_c = "XNumberFormatterSettingsFactoryImpl";

oFF.XNumberFormatterSettingsFactoryImpl.charComma = 44;
oFF.XNumberFormatterSettingsFactoryImpl.charDot = 46;
oFF.XNumberFormatterSettingsFactoryImpl.digit = 35;
oFF.XNumberFormatterSettingsFactoryImpl.negativePrefix = 45;
oFF.XNumberFormatterSettingsFactoryImpl.positivePrefix = 43;
oFF.XNumberFormatterSettingsFactoryImpl.zeroInAbsence = 48;
oFF.XNumberFormatterSettingsFactoryImpl.staticSetup = function()
{
	oFF.XNumberFormatterSettingsFactory.s_instance = new oFF.XNumberFormatterSettingsFactoryImpl();
};
oFF.XNumberFormatterSettingsFactoryImpl.prototype.calculateExp = function(exponent)
{
	let result = 1000;
	for (let i = 1; i < exponent; i++)
	{
		result = result * result;
	}
	return result;
};
oFF.XNumberFormatterSettingsFactoryImpl.prototype.create = function()
{
	return oFF.XNumberFormatterSettings.create();
};
oFF.XNumberFormatterSettingsFactoryImpl.prototype.create2 = function()
{
	return this.create();
};
oFF.XNumberFormatterSettingsFactoryImpl.prototype.createFromString = function(numberFormat)
{
	let prefixSign = 0;
	let zeroInAbsenceLeft = 0;
	let zeroInAbsenceRight = 0;
	let digitsRight = 0;
	let digitsLeft = 0;
	let isRight = false;
	let thousandSeparators = 0;
	for (let i = 0; i < oFF.XString.size(numberFormat); i++)
	{
		let currentChar = oFF.XString.getCharAt(numberFormat, i);
		if (currentChar === oFF.XNumberFormatterSettingsFactoryImpl.negativePrefix || currentChar === oFF.XNumberFormatterSettingsFactoryImpl.positivePrefix)
		{
			prefixSign = currentChar;
		}
		if (currentChar === oFF.XNumberFormatterSettingsFactoryImpl.digit || currentChar === oFF.XNumberFormatterSettingsFactoryImpl.zeroInAbsence)
		{
			if (isRight)
			{
				digitsRight++;
			}
			else
			{
				digitsLeft++;
			}
		}
		if (currentChar === oFF.XNumberFormatterSettingsFactoryImpl.zeroInAbsence)
		{
			if (isRight)
			{
				zeroInAbsenceRight++;
			}
			else
			{
				zeroInAbsenceLeft++;
			}
		}
		if (currentChar === oFF.XNumberFormatterSettingsFactoryImpl.charDot)
		{
			isRight = true;
		}
		if (currentChar === oFF.XNumberFormatterSettingsFactoryImpl.charComma)
		{
			thousandSeparators++;
		}
	}
	let settings = oFF.XNumberFormatterSettings.create();
	if (digitsLeft > 1)
	{
		settings.setDecimalGroupingSeparator(",");
	}
	settings.setDecimalSeparator(".");
	if (zeroInAbsenceLeft > 0)
	{
		settings.setLeftPad(digitsLeft);
	}
	settings.setMaxDigitsRight(digitsRight);
	if (zeroInAbsenceRight > 0)
	{
		settings.setRightPad(digitsRight);
	}
	if (digitsLeft === 1 && thousandSeparators > 0)
	{
		settings.setScale(this.calculateExp(thousandSeparators));
	}
	settings.setPrefix(prefixSign);
	return settings;
};
oFF.XNumberFormatterSettingsFactoryImpl.prototype.merge = function(nullableTarget, nullableSource)
{
	let target = oFF.isNull(nullableTarget) ? this.create2() : nullableTarget;
	let source = oFF.isNull(nullableSource) ? this.create2() : nullableSource;
	let settings = this.create();
	settings.setDecimalGroupingSeparator(source.getDecimalGroupingSeparator() !== null ? source.getDecimalGroupingSeparator() : target.getDecimalGroupingSeparator());
	settings.setDecimalSeparator(source.getDecimalSeparator() !== null ? source.getDecimalSeparator() : target.getDecimalSeparator());
	settings.setScaleFactor(source.getScaleFactor() !== null ? source.getScaleFactor() : target.getScaleFactor());
	settings.setMaxDigitsRight(source.getMaxDigitsRight() >= 0 ? source.getMaxDigitsRight() : target.getMaxDigitsRight());
	settings.setRightPad(source.getRightPad() >= 0 ? source.getRightPad() : target.getRightPad());
	let currencyFormatSettingsBase = settings.getCurrencyFormatSettings();
	currencyFormatSettingsBase.merge(target.getCurrencyFormatSettings());
	currencyFormatSettingsBase.merge(source.getCurrencyFormatSettings());
	settings.setScaleFormat(source.getScaleFormat() !== null ? source.getScaleFormat() : target.getScaleFormat());
	settings.setSignPresentation(source.getSignPresentation() !== null ? source.getSignPresentation() : target.getSignPresentation());
	return settings;
};

oFF.DateConstants = function() {};
oFF.DateConstants.prototype = new oFF.XConstant();
oFF.DateConstants.prototype._ff_c = "DateConstants";

oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH = null;
oFF.DateConstants.AM = 0;
oFF.DateConstants.AM_PM = 9;
oFF.DateConstants.APRIL = 4;
oFF.DateConstants.AUGUST = 8;
oFF.DateConstants.DATE = 5;
oFF.DateConstants.DAYS_IN_COMMON_YEAR = null;
oFF.DateConstants.DAYS_IN_LEAP_YEAR = null;
oFF.DateConstants.DAYS_IN_MONTH = null;
oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR = null;
oFF.DateConstants.DAY_IN_MILLIS = 86400000;
oFF.DateConstants.DAY_OF_MONTH = 5;
oFF.DateConstants.DAY_OF_WEEK = 7;
oFF.DateConstants.DAY_OF_WEEK_IN_MONTH = 8;
oFF.DateConstants.DAY_OF_YEAR = 6;
oFF.DateConstants.DECEMBER = 12;
oFF.DateConstants.DST_OFFSET = 16;
oFF.DateConstants.ERA = 0;
oFF.DateConstants.FEBRUARY = 2;
oFF.DateConstants.FIELD_COUNT = 19;
oFF.DateConstants.FIELD_UNDEFINED = 0;
oFF.DateConstants.FIXED_DATES = null;
oFF.DateConstants.FRIDAY = 6;
oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM = null;
oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM = null;
oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM = null;
oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM = null;
oFF.DateConstants.HALF_YEAR = 18;
oFF.DateConstants.HEISI = 4;
oFF.DateConstants.HOUR = 10;
oFF.DateConstants.HOUR_IN_MILLIS = 3600000;
oFF.DateConstants.HOUR_OF_DAY = 11;
oFF.DateConstants.JANUARY = 1;
oFF.DateConstants.JAPANESE_ERAS = null;
oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM = null;
oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM = null;
oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM = null;
oFF.DateConstants.JULY = 7;
oFF.DateConstants.JUNE = 6;
oFF.DateConstants.MARCH = 3;
oFF.DateConstants.MAY = 5;
oFF.DateConstants.MEIJI = 1;
oFF.DateConstants.MILLISECOND = 14;
oFF.DateConstants.MINUTE = 12;
oFF.DateConstants.MINUTE_IN_MILLIS = 60000;
oFF.DateConstants.MONDAY = 2;
oFF.DateConstants.MONTH = 2;
oFF.DateConstants.NOVEMBER = 11;
oFF.DateConstants.OCTOBER = 10;
oFF.DateConstants.ONE_YEAR_IN_DAYS = 365;
oFF.DateConstants.PM = 1;
oFF.DateConstants.QUARTER = 17;
oFF.DateConstants.REIWA = 5;
oFF.DateConstants.SATURDAY = 7;
oFF.DateConstants.SECOND = 13;
oFF.DateConstants.SECOND_IN_MILLIS = 1000;
oFF.DateConstants.SEPTEMBER = 9;
oFF.DateConstants.SHOWA = 3;
oFF.DateConstants.SUNDAY = 1;
oFF.DateConstants.TAISHO = 2;
oFF.DateConstants.THURSDAY = 5;
oFF.DateConstants.TIME_UNDEFINED = 0;
oFF.DateConstants.TUESDAY = 3;
oFF.DateConstants.UNDECEMBER = 12;
oFF.DateConstants.WEDNESDAY = 4;
oFF.DateConstants.WEEK_IN_MILLIS = 604800000;
oFF.DateConstants.WEEK_OF_MONTH = 4;
oFF.DateConstants.WEEK_OF_YEAR = 3;
oFF.DateConstants.YEAR = 1;
oFF.DateConstants.ZONE_OFFSET = 15;
oFF.DateConstants.setAccumulatedDaysInMonth = function()
{
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH = oFF.XArrayOfInt.create(13);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(0, -30);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(1, 0);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(2, 31);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(3, 59);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(4, 90);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(5, 120);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(6, 151);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(7, 181);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(8, 212);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(9, 243);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(10, 273);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(11, 304);
	oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.set(12, 334);
};
oFF.DateConstants.setDaysInCommonYear = function()
{
	oFF.DateConstants.DAYS_IN_COMMON_YEAR = oFF.XArrayOfInt.create(13);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(0, 0);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(1, 31);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(2, 59);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(3, 90);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(4, 120);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(5, 151);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(6, 181);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(7, 212);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(8, 243);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(9, 273);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(10, 304);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(11, 334);
	oFF.DateConstants.DAYS_IN_COMMON_YEAR.set(12, 365);
};
oFF.DateConstants.setDaysInLeapYear = function()
{
	oFF.DateConstants.DAYS_IN_LEAP_YEAR = oFF.XArrayOfInt.create(13);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(0, 0);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(1, 31);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(2, 60);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(3, 91);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(4, 121);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(5, 152);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(6, 182);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(7, 213);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(8, 244);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(9, 274);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(10, 305);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(11, 335);
	oFF.DateConstants.DAYS_IN_LEAP_YEAR.set(12, 366);
};
oFF.DateConstants.setDaysInMonth = function()
{
	oFF.DateConstants.DAYS_IN_MONTH = oFF.XArrayOfInt.create(12);
	oFF.DateConstants.DAYS_IN_MONTH.set(0, 31);
	oFF.DateConstants.DAYS_IN_MONTH.set(1, 28);
	oFF.DateConstants.DAYS_IN_MONTH.set(2, 31);
	oFF.DateConstants.DAYS_IN_MONTH.set(3, 30);
	oFF.DateConstants.DAYS_IN_MONTH.set(4, 31);
	oFF.DateConstants.DAYS_IN_MONTH.set(5, 30);
	oFF.DateConstants.DAYS_IN_MONTH.set(6, 31);
	oFF.DateConstants.DAYS_IN_MONTH.set(7, 31);
	oFF.DateConstants.DAYS_IN_MONTH.set(8, 30);
	oFF.DateConstants.DAYS_IN_MONTH.set(9, 31);
	oFF.DateConstants.DAYS_IN_MONTH.set(10, 30);
	oFF.DateConstants.DAYS_IN_MONTH.set(11, 31);
};
oFF.DateConstants.setDaysInMonthLeapYear = function()
{
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR = oFF.XArrayOfInt.create(12);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(0, 31);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(1, 29);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(2, 31);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(3, 30);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(4, 31);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(5, 30);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(6, 31);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(7, 31);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(8, 30);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(9, 31);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(10, 30);
	oFF.DateConstants.DAYS_IN_MONTH_LEAP_YEAR.set(11, 31);
};
oFF.DateConstants.setFixedDates = function()
{
	oFF.DateConstants.FIXED_DATES = oFF.XArrayOfInt.create(70);
	oFF.DateConstants.FIXED_DATES.set(0, 719163);
	oFF.DateConstants.FIXED_DATES.set(1, 719528);
	oFF.DateConstants.FIXED_DATES.set(2, 719893);
	oFF.DateConstants.FIXED_DATES.set(3, 720259);
	oFF.DateConstants.FIXED_DATES.set(4, 720624);
	oFF.DateConstants.FIXED_DATES.set(5, 720989);
	oFF.DateConstants.FIXED_DATES.set(6, 721354);
	oFF.DateConstants.FIXED_DATES.set(7, 721720);
	oFF.DateConstants.FIXED_DATES.set(8, 722085);
	oFF.DateConstants.FIXED_DATES.set(9, 722450);
	oFF.DateConstants.FIXED_DATES.set(10, 722815);
	oFF.DateConstants.FIXED_DATES.set(11, 723181);
	oFF.DateConstants.FIXED_DATES.set(12, 723546);
	oFF.DateConstants.FIXED_DATES.set(13, 723911);
	oFF.DateConstants.FIXED_DATES.set(14, 724276);
	oFF.DateConstants.FIXED_DATES.set(15, 724642);
	oFF.DateConstants.FIXED_DATES.set(16, 725007);
	oFF.DateConstants.FIXED_DATES.set(17, 725372);
	oFF.DateConstants.FIXED_DATES.set(18, 725737);
	oFF.DateConstants.FIXED_DATES.set(19, 726103);
	oFF.DateConstants.FIXED_DATES.set(20, 726468);
	oFF.DateConstants.FIXED_DATES.set(21, 726833);
	oFF.DateConstants.FIXED_DATES.set(22, 727198);
	oFF.DateConstants.FIXED_DATES.set(23, 727564);
	oFF.DateConstants.FIXED_DATES.set(24, 727929);
	oFF.DateConstants.FIXED_DATES.set(25, 728294);
	oFF.DateConstants.FIXED_DATES.set(26, 728659);
	oFF.DateConstants.FIXED_DATES.set(27, 729025);
	oFF.DateConstants.FIXED_DATES.set(28, 729390);
	oFF.DateConstants.FIXED_DATES.set(29, 729755);
	oFF.DateConstants.FIXED_DATES.set(30, 730120);
	oFF.DateConstants.FIXED_DATES.set(31, 730486);
	oFF.DateConstants.FIXED_DATES.set(32, 730851);
	oFF.DateConstants.FIXED_DATES.set(33, 731216);
	oFF.DateConstants.FIXED_DATES.set(34, 731581);
	oFF.DateConstants.FIXED_DATES.set(35, 731947);
	oFF.DateConstants.FIXED_DATES.set(36, 732312);
	oFF.DateConstants.FIXED_DATES.set(37, 732677);
	oFF.DateConstants.FIXED_DATES.set(38, 733042);
	oFF.DateConstants.FIXED_DATES.set(39, 733408);
	oFF.DateConstants.FIXED_DATES.set(40, 733773);
	oFF.DateConstants.FIXED_DATES.set(41, 734138);
	oFF.DateConstants.FIXED_DATES.set(42, 734503);
	oFF.DateConstants.FIXED_DATES.set(43, 734869);
	oFF.DateConstants.FIXED_DATES.set(44, 735234);
	oFF.DateConstants.FIXED_DATES.set(45, 735599);
	oFF.DateConstants.FIXED_DATES.set(46, 735964);
	oFF.DateConstants.FIXED_DATES.set(47, 736330);
	oFF.DateConstants.FIXED_DATES.set(48, 736695);
	oFF.DateConstants.FIXED_DATES.set(49, 737060);
	oFF.DateConstants.FIXED_DATES.set(50, 737425);
	oFF.DateConstants.FIXED_DATES.set(51, 737791);
	oFF.DateConstants.FIXED_DATES.set(52, 738156);
	oFF.DateConstants.FIXED_DATES.set(53, 738521);
	oFF.DateConstants.FIXED_DATES.set(54, 738886);
	oFF.DateConstants.FIXED_DATES.set(55, 739252);
	oFF.DateConstants.FIXED_DATES.set(56, 739617);
	oFF.DateConstants.FIXED_DATES.set(57, 739982);
	oFF.DateConstants.FIXED_DATES.set(58, 740347);
	oFF.DateConstants.FIXED_DATES.set(59, 740713);
	oFF.DateConstants.FIXED_DATES.set(60, 741078);
	oFF.DateConstants.FIXED_DATES.set(61, 741443);
	oFF.DateConstants.FIXED_DATES.set(62, 741808);
	oFF.DateConstants.FIXED_DATES.set(63, 742174);
	oFF.DateConstants.FIXED_DATES.set(64, 742539);
	oFF.DateConstants.FIXED_DATES.set(65, 742904);
	oFF.DateConstants.FIXED_DATES.set(66, 743269);
	oFF.DateConstants.FIXED_DATES.set(67, 743635);
	oFF.DateConstants.FIXED_DATES.set(68, 744000);
	oFF.DateConstants.FIXED_DATES.set(69, 744365);
};
oFF.DateConstants.setGregorianCalendarFieldsGreatestMinimum = function()
{
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.ERA, oFF.XGregorianCalendar.AD);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.YEAR, 1582);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.HOUR, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.QUARTER, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.MONTH, oFF.DateConstants.JANUARY);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.WEEK_OF_YEAR, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.WEEK_OF_MONTH, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.DAY_OF_MONTH, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.DAY_OF_YEAR, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.DAY_OF_WEEK, oFF.DateConstants.SUNDAY);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.AM_PM, oFF.DateConstants.AM);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.HOUR, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.HOUR_OF_DAY, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.MINUTE, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.SECOND, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.MILLISECOND, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.ZONE_OFFSET, -12 * oFF.DateConstants.HOUR_IN_MILLIS);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_GREATEST_MINIMUM.set(oFF.DateConstants.DST_OFFSET, 0);
};
oFF.DateConstants.setGregorianCalendarFieldsLeastMaximum = function()
{
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.ERA, oFF.XGregorianCalendar.AD);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.YEAR, 9999);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.HALF_YEAR, 2);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.QUARTER, 4);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.MONTH, oFF.DateConstants.DECEMBER);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.WEEK_OF_YEAR, 52);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.WEEK_OF_MONTH, 4);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_MONTH, 28);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_YEAR, 365);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK, oFF.DateConstants.SATURDAY);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, 4);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.AM_PM, oFF.DateConstants.PM);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.HOUR, 11);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.HOUR_OF_DAY, 23);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.MINUTE, 59);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.SECOND, 59);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.MILLISECOND, 999);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.ZONE_OFFSET, 12 * oFF.DateConstants.HOUR_IN_MILLIS);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DST_OFFSET, oFF.DateConstants.HOUR_IN_MILLIS);
};
oFF.DateConstants.setGregorianCalendarFieldsMaximum = function()
{
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.ERA, oFF.XGregorianCalendar.AD);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.YEAR, 9999);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.HALF_YEAR, 2);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.QUARTER, 4);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.MONTH, oFF.DateConstants.DECEMBER);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.WEEK_OF_YEAR, 53);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.WEEK_OF_MONTH, 6);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_MONTH, 31);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_YEAR, 366);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK, oFF.DateConstants.SATURDAY);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, 5);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.AM_PM, oFF.DateConstants.PM);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.HOUR, 11);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.HOUR_OF_DAY, 23);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.MINUTE, 59);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.SECOND, 59);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.MILLISECOND, 999);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.ZONE_OFFSET, 12 * oFF.DateConstants.HOUR_IN_MILLIS);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DST_OFFSET, oFF.DateConstants.HOUR_IN_MILLIS);
};
oFF.DateConstants.setGregorianCalendarFieldsMinimum = function()
{
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.ERA, oFF.XGregorianCalendar.AD);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.YEAR, 1582);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.HALF_YEAR, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.QUARTER, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.MONTH, oFF.DateConstants.JANUARY);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.WEEK_OF_YEAR, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.WEEK_OF_MONTH, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_MONTH, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_YEAR, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_WEEK, oFF.DateConstants.SUNDAY);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, 1);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.AM_PM, oFF.DateConstants.AM);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.HOUR, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.HOUR_OF_DAY, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.MINUTE, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.SECOND, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.MILLISECOND, 0);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.ZONE_OFFSET, -12 * oFF.DateConstants.HOUR_IN_MILLIS);
	oFF.DateConstants.GREGORIAN_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DST_OFFSET, 0);
};
oFF.DateConstants.setJapaneseEras = function()
{
	oFF.DateConstants.JAPANESE_ERAS = oFF.XArray.create(6);
	oFF.DateConstants.JAPANESE_ERAS.set(0, oFF.XEra.create("BeforeMeiji", "BM", oFF.XLong.getMinimumValue(), false));
	oFF.DateConstants.JAPANESE_ERAS.set(1, oFF.XEra.create("Meiji", "M", -3218832000000, true));
	oFF.DateConstants.JAPANESE_ERAS.set(2, oFF.XEra.create("Taisho", "T", -1812153600000, true));
	oFF.DateConstants.JAPANESE_ERAS.set(3, oFF.XEra.create("Showa", "S", -1357603200000, true));
	oFF.DateConstants.JAPANESE_ERAS.set(4, oFF.XEra.create("Heisei", "H", 600220800000, true));
	oFF.DateConstants.JAPANESE_ERAS.set(5, oFF.XEra.create("Reiwa", "R", 1556668800000, true));
};
oFF.DateConstants.setJapaneseImperialCalendarFieldsLeastMaximum = function()
{
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.ERA, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.YEAR, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.HALF_YEAR, 2);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.QUARTER, 4);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.MONTH, oFF.DateConstants.JANUARY);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.WEEK_OF_YEAR, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.WEEK_OF_MONTH, 4);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_MONTH, 28);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_YEAR, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK, oFF.DateConstants.SATURDAY);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, 4);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.AM_PM, oFF.DateConstants.PM);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.HOUR, 11);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.HOUR_OF_DAY, 23);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.MINUTE, 59);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.SECOND, 59);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.MILLISECOND, 999);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.ZONE_OFFSET, 12 * oFF.DateConstants.HOUR_IN_MILLIS);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_LEAST_MAXIMUM.set(oFF.DateConstants.DST_OFFSET, 20 * oFF.DateConstants.MINUTE_IN_MILLIS);
};
oFF.DateConstants.setJapaneseImperialCalendarFieldsMaximum = function()
{
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.ERA, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.YEAR, 292278994);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.HALF_YEAR, 2);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.QUARTER, 4);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.MONTH, oFF.DateConstants.DECEMBER);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.WEEK_OF_YEAR, 53);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.WEEK_OF_MONTH, 6);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_MONTH, 31);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_YEAR, 366);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK, oFF.DateConstants.SATURDAY);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, 6);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.AM_PM, oFF.DateConstants.PM);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.HOUR, 11);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.HOUR_OF_DAY, 23);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.MINUTE, 59);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.SECOND, 59);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.MILLISECOND, 999);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.ZONE_OFFSET, 12 * oFF.DateConstants.HOUR_IN_MILLIS);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MAXIMUM.set(oFF.DateConstants.DST_OFFSET, 2 * oFF.DateConstants.HOUR_IN_MILLIS);
};
oFF.DateConstants.setJapaneseImperialCalendarFieldsMinimum = function()
{
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM = oFF.XArrayOfInt.create(oFF.DateConstants.FIELD_COUNT);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.ERA, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.YEAR, -292275055);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.HALF_YEAR, 1);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.QUARTER, 1);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.MONTH, oFF.DateConstants.JANUARY);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.WEEK_OF_YEAR, 1);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.WEEK_OF_MONTH, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_MONTH, 1);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_YEAR, 1);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_WEEK, oFF.DateConstants.SUNDAY);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DAY_OF_WEEK_IN_MONTH, 1);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.AM_PM, oFF.DateConstants.AM);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.HOUR, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.HOUR_OF_DAY, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.MINUTE, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.SECOND, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.MILLISECOND, 0);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.ZONE_OFFSET, -13 * oFF.DateConstants.HOUR_IN_MILLIS);
	oFF.DateConstants.JAPANESE_IMPERIAL_CALENDAR_FIELDS_MINIMUM.set(oFF.DateConstants.DST_OFFSET, 0);
};
oFF.DateConstants.staticSetup = function()
{
	oFF.DateConstants.setDaysInCommonYear();
	oFF.DateConstants.setDaysInLeapYear();
	oFF.DateConstants.setDaysInMonth();
	oFF.DateConstants.setFixedDates();
	oFF.DateConstants.setGregorianCalendarFieldsMinimum();
	oFF.DateConstants.setGregorianCalendarFieldsGreatestMinimum();
	oFF.DateConstants.setGregorianCalendarFieldsMaximum();
	oFF.DateConstants.setGregorianCalendarFieldsLeastMaximum();
	oFF.DateConstants.setAccumulatedDaysInMonth();
	oFF.DateConstants.setJapaneseEras();
	oFF.DateConstants.setJapaneseImperialCalendarFieldsMinimum();
	oFF.DateConstants.setJapaneseImperialCalendarFieldsMaximum();
	oFF.DateConstants.setJapaneseImperialCalendarFieldsLeastMaximum();
	oFF.DateConstants.setDaysInMonthLeapYear();
	oFF.DateConstants.setJapaneseEras();
	oFF.DateConstants.FIELD_UNDEFINED = oFF.XInteger.getMinimumValue();
	oFF.DateConstants.TIME_UNDEFINED = oFF.XInteger.getMinimumValue();
};

oFF.TimeZonesConstants = function() {};
oFF.TimeZonesConstants.prototype = new oFF.XConstant();
oFF.TimeZonesConstants.prototype._ff_c = "TimeZonesConstants";

oFF.TimeZonesConstants.timezones = null;
oFF.TimeZonesConstants.getTimezone = function(timezoneId)
{
	let timeZone = oFF.TimeZonesConstants.timezones.getByKey(timezoneId);
	if (oFF.isNull(timeZone))
	{
		timeZone = oFF.XSimpleTimeZone.create();
	}
	return timeZone;
};
oFF.TimeZonesConstants.staticSetup = function()
{
	oFF.TimeZonesConstants.timezones = oFF.XHashMapByString.create();
	oFF.TimeZonesConstants.timezones.put("Atlantic/Cape_Verde", oFF.XSimpleTimeZone.createWithOffsetAndId(-3600000, "Atlantic/Cape_Verde"));
	oFF.TimeZonesConstants.timezones.put("Africa/Abidjan", oFF.XSimpleTimeZone.createWithOffsetAndId(0, "Africa/Abidjan"));
	oFF.TimeZonesConstants.timezones.put("Africa/Accra", oFF.XSimpleTimeZone.createWithOffsetAndId(0, "Africa/Accra"));
	oFF.TimeZonesConstants.timezones.put("Africa/Bissau", oFF.XSimpleTimeZone.createWithOffsetAndId(0, "Africa/Bissau"));
	oFF.TimeZonesConstants.timezones.put("Africa/Monrovia", oFF.XSimpleTimeZone.createWithOffsetAndId(0, "Africa/Monrovia"));
	oFF.TimeZonesConstants.timezones.put("Africa/Sao_Tome", oFF.XSimpleTimeZone.createWithOffsetAndId(0, "Africa/Sao_Tome"));
	oFF.TimeZonesConstants.timezones.put("Africa/Algiers", oFF.XSimpleTimeZone.createWithOffsetAndId(3600000, "Africa/Algiers"));
	oFF.TimeZonesConstants.timezones.put("Africa/Ndjamena", oFF.XSimpleTimeZone.createWithOffsetAndId(3600000, "Africa/Ndjamena"));
	oFF.TimeZonesConstants.timezones.put("Africa/Lagos", oFF.XSimpleTimeZone.createWithOffsetAndId(3600000, "Africa/Lagos"));
	oFF.TimeZonesConstants.timezones.put("Africa/Tunis", oFF.XSimpleTimeZone.createWithOffsetAndId(3600000, "Africa/Tunis"));
	oFF.TimeZonesConstants.timezones.put("Africa/Cairo", oFF.XSimpleTimeZone.createWithOffsetAndId(7200000, "Africa/Cairo"));
	oFF.TimeZonesConstants.timezones.put("Africa/Tripoli", oFF.XSimpleTimeZone.createWithOffsetAndId(7200000, "Africa/Tripoli"));
	oFF.TimeZonesConstants.timezones.put("Africa/Maputo", oFF.XSimpleTimeZone.createWithOffsetAndId(7200000, "Africa/Maputo"));
	oFF.TimeZonesConstants.timezones.put("Africa/Windhoek", oFF.XSimpleTimeZone.createWithOffsetAndId(7200000, "Africa/Windhoek"));
	oFF.TimeZonesConstants.timezones.put("Africa/Johannesburg", oFF.XSimpleTimeZone.createWithOffsetAndId(7200000, "Africa/Johannesburg"));
	oFF.TimeZonesConstants.timezones.put("Africa/Khartoum", oFF.XSimpleTimeZone.createWithOffsetAndId(7200000, "Africa/Khartoum"));
	oFF.TimeZonesConstants.timezones.put("Africa/Nairobi", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Africa/Nairobi"));
	oFF.TimeZonesConstants.timezones.put("Africa/Juba", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Africa/Juba"));
	oFF.TimeZonesConstants.timezones.put("Indian/Mauritius", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Indian/Mauritius"));
	oFF.TimeZonesConstants.timezones.put("Indian/Reunion", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Indian/Reunion"));
	oFF.TimeZonesConstants.timezones.put("Indian/Mahe", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Indian/Mahe"));
	oFF.TimeZonesConstants.timezones.put("America/New_York", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/New_York", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Indiana/Indianapolis", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Indiana/Indianapolis", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Detroit", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Detroit", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Chicago", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Chicago", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Menominee", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Menominee", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Indiana/Tell_City", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Indiana/Tell_City", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Indiana/Knox", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Indiana/Knox", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/North_Dakota/Center", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/North_Dakota/Center", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/North_Dakota/New_Salem", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/North_Dakota/New_Salem", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/North_Dakota/Beulah", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/North_Dakota/Beulah", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Denver", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Denver", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Boise", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Boise", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Phoenix", oFF.XSimpleTimeZone.createWithOffsetAndId(-25200000, "America/Phoenix"));
	oFF.TimeZonesConstants.timezones.put("America/Los_Angeles", oFF.XSimpleTimeZone.createWithUTCMode(-28800000, "America/Los_Angeles", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 36000000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 32400000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Juneau", oFF.XSimpleTimeZone.createWithUTCMode(-32400000, "America/Juneau", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 39600000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 36000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Sitka", oFF.XSimpleTimeZone.createWithUTCMode(-32400000, "America/Sitka", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 39600000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 36000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Metlakatla", oFF.XSimpleTimeZone.createWithUTCMode(-32400000, "America/Metlakatla", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 39600000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 36000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Yakutat", oFF.XSimpleTimeZone.createWithUTCMode(-32400000, "America/Yakutat", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 39600000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 36000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Anchorage", oFF.XSimpleTimeZone.createWithUTCMode(-32400000, "America/Anchorage", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 39600000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 36000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Nome", oFF.XSimpleTimeZone.createWithUTCMode(-32400000, "America/Nome", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 39600000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 36000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Adak", oFF.XSimpleTimeZone.createWithUTCMode(-36000000, "America/Adak", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 43200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 39600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Pacific/Honolulu", oFF.XSimpleTimeZone.createWithOffsetAndId(-36000000, "Pacific/Honolulu"));
	oFF.TimeZonesConstants.timezones.put("America/St_Johns", oFF.XSimpleTimeZone.createWithUTCMode(-12600000, "America/St_Johns", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 19800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 16200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Goose_Bay", oFF.XSimpleTimeZone.createWithUTCMode(-14400000, "America/Goose_Bay", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 21600000, oFF.DateConstants.NOVEMBER, 2, oFF.DateConstants.SUNDAY, 18000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Halifax", oFF.XSimpleTimeZone.createWithUTCMode(-14400000, "America/Halifax", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 21600000, oFF.DateConstants.NOVEMBER, 2, oFF.DateConstants.SUNDAY, 18000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Glace_Bay", oFF.XSimpleTimeZone.createWithUTCMode(-14400000, "America/Glace_Bay", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 21600000, oFF.DateConstants.NOVEMBER, 2, oFF.DateConstants.SUNDAY, 18000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Moncton", oFF.XSimpleTimeZone.createWithUTCMode(-14400000, "America/Moncton", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 21600000, oFF.DateConstants.NOVEMBER, 2, oFF.DateConstants.SUNDAY, 18000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Blanc-Sablon", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Blanc-Sablon"));
	oFF.TimeZonesConstants.timezones.put("America/Toronto", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Toronto", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Pangnirtung", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Pangnirtung", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Iqaluit", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Iqaluit", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Thunder_Bay", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Thunder_Bay", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Nipigon", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Nipigon", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Atikokan", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Atikokan"));
	oFF.TimeZonesConstants.timezones.put("America/Rainy_River", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Rainy_River", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Winnipeg", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Winnipeg", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Resolute", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Resolute", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Rankin_Inlet", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Rankin_Inlet", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Regina", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/Regina"));
	oFF.TimeZonesConstants.timezones.put("America/Swift_Current", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/Swift_Current"));
	oFF.TimeZonesConstants.timezones.put("America/Edmonton", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Edmonton", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Cambridge_Bay", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Cambridge_Bay", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Yellowknife", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Yellowknife", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Inuvik", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Inuvik", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Dawson_Creek", oFF.XSimpleTimeZone.createWithOffsetAndId(-25200000, "America/Dawson_Creek"));
	oFF.TimeZonesConstants.timezones.put("America/Whitehorse", oFF.XSimpleTimeZone.createWithOffsetAndId(-25200000, "America/Whitehorse"));
	oFF.TimeZonesConstants.timezones.put("America/Dawson", oFF.XSimpleTimeZone.createWithOffsetAndId(-25200000, "America/Dawson"));
	oFF.TimeZonesConstants.timezones.put("America/Fort_Nelson", oFF.XSimpleTimeZone.createWithOffsetAndId(-25200000, "America/Fort_Nelson"));
	oFF.TimeZonesConstants.timezones.put("America/Creston", oFF.XSimpleTimeZone.createWithOffsetAndId(-25200000, "America/Creston"));
	oFF.TimeZonesConstants.timezones.put("America/Vancouver", oFF.XSimpleTimeZone.createWithUTCMode(-28800000, "America/Vancouver", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 36000000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 32400000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Cancun", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Cancun"));
	oFF.TimeZonesConstants.timezones.put("America/Merida", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Merida", oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Matamoros", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Matamoros", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Monterrey", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Monterrey", oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Mexico_City", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Mexico_City", oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Bahia_Banderas", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "America/Bahia_Banderas", oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 28800000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 25200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Ojinaga", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Ojinaga", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Chihuahua", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Chihuahua", oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Hermosillo", oFF.XSimpleTimeZone.createWithOffsetAndId(-25200000, "America/Hermosillo"));
	oFF.TimeZonesConstants.timezones.put("America/Mazatlan", oFF.XSimpleTimeZone.createWithUTCMode(-25200000, "America/Mazatlan", oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 32400000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 28800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Tijuana", oFF.XSimpleTimeZone.createWithUTCMode(-28800000, "America/Tijuana", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 36000000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 32400000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Miquelon", oFF.XSimpleTimeZone.createWithUTCMode(-10800000, "America/Miquelon", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 18000000, oFF.DateConstants.NOVEMBER, 2, oFF.DateConstants.SUNDAY, 14400000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Barbados", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Barbados"));
	oFF.TimeZonesConstants.timezones.put("America/Santo_Domingo", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Santo_Domingo"));
	oFF.TimeZonesConstants.timezones.put("Atlantic/Bermuda", oFF.XSimpleTimeZone.createWithUTCMode(-14400000, "Atlantic/Bermuda", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 21600000, oFF.DateConstants.NOVEMBER, 2, oFF.DateConstants.SUNDAY, 18000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Martinique", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Martinique"));
	oFF.TimeZonesConstants.timezones.put("America/Puerto_Rico", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Puerto_Rico"));
	oFF.TimeZonesConstants.timezones.put("America/Nassau", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Nassau", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Havana", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Havana", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 18000000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 18000000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Port-au-Prince", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Port-au-Prince", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Grand_Turk", oFF.XSimpleTimeZone.createWithUTCMode(-18000000, "America/Grand_Turk", oFF.DateConstants.MARCH, 2, oFF.DateConstants.SUNDAY, 25200000, oFF.DateConstants.NOVEMBER, 1, oFF.DateConstants.SUNDAY, 21600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Jamaica", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Jamaica"));
	oFF.TimeZonesConstants.timezones.put("America/Panama", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Panama"));
	oFF.TimeZonesConstants.timezones.put("America/Belize", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/Belize"));
	oFF.TimeZonesConstants.timezones.put("America/Tegucigalpa", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/Tegucigalpa"));
	oFF.TimeZonesConstants.timezones.put("America/Costa_Rica", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/Costa_Rica"));
	oFF.TimeZonesConstants.timezones.put("America/El_Salvador", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/El_Salvador"));
	oFF.TimeZonesConstants.timezones.put("America/Guatemala", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/Guatemala"));
	oFF.TimeZonesConstants.timezones.put("America/Managua", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "America/Managua"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Buenos_Aires", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Buenos_Aires"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Cordoba", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Cordoba"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Salta", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Salta"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Tucuman", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Tucuman"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/La_Rioja", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/La_Rioja"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/San_Juan", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/San_Juan"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Jujuy", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Jujuy"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Catamarca", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Catamarca"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Mendonza", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Mendonza"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/San_Luis", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/San_Luis"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Rio_Gallegos", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Rio_Gallegos"));
	oFF.TimeZonesConstants.timezones.put("America/Argentina/Ushuaia", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Argentina/Ushuaia"));
	oFF.TimeZonesConstants.timezones.put("America/La_Paz", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/La_Paz"));
	oFF.TimeZonesConstants.timezones.put("America/Noronha", oFF.XSimpleTimeZone.createWithOffsetAndId(-7200000, "America/Noronha"));
	oFF.TimeZonesConstants.timezones.put("America/Belem", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Belem"));
	oFF.TimeZonesConstants.timezones.put("America/Santarem", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Santarem"));
	oFF.TimeZonesConstants.timezones.put("America/Fortaleza", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Fortaleza"));
	oFF.TimeZonesConstants.timezones.put("America/Recife", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Recife"));
	oFF.TimeZonesConstants.timezones.put("America/Araguaina", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Araguaina"));
	oFF.TimeZonesConstants.timezones.put("America/Maceio", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Maceio"));
	oFF.TimeZonesConstants.timezones.put("America/Bahia", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Bahia"));
	oFF.TimeZonesConstants.timezones.put("America/Sao_Paulo", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Sao_Paulo"));
	oFF.TimeZonesConstants.timezones.put("America/Campo_Grande", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Campo_Grande"));
	oFF.TimeZonesConstants.timezones.put("America/Cuiaba", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Cuiaba"));
	oFF.TimeZonesConstants.timezones.put("America/Porto_Velho", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Porto_Velho"));
	oFF.TimeZonesConstants.timezones.put("America/Boa_Vista", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Boa_Vista"));
	oFF.TimeZonesConstants.timezones.put("America/Manaus", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Manaus"));
	oFF.TimeZonesConstants.timezones.put("America/Eirunepe", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Eirunepe"));
	oFF.TimeZonesConstants.timezones.put("America/Rio_Branco", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Rio_Branco"));
	oFF.TimeZonesConstants.timezones.put("America/Santiago", oFF.XSimpleTimeZone.createWithUTCMode(-14400000, "America/Santiago", oFF.DateConstants.SEPTEMBER, 1, oFF.DateConstants.SUNDAY, 14400000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Punta_Arenas", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Punta_Arenas"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Easter", oFF.XSimpleTimeZone.createWithUTCMode(-21600000, "Pacific/Easter", oFF.DateConstants.SEPTEMBER, 1, oFF.DateConstants.SUNDAY, 14400000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Palmer", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "Antarctica/Palmer"));
	oFF.TimeZonesConstants.timezones.put("America/Bogota", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Bogota"));
	oFF.TimeZonesConstants.timezones.put("America/Curacao", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Curacao"));
	oFF.TimeZonesConstants.timezones.put("America/Guayaquil", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Guayaquil"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Galapagos", oFF.XSimpleTimeZone.createWithOffsetAndId(-21600000, "Pacific/Galapagos"));
	oFF.TimeZonesConstants.timezones.put("Atlantic/Stanley", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "Atlantic/Stanley"));
	oFF.TimeZonesConstants.timezones.put("America/Cayene", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Cayene"));
	oFF.TimeZonesConstants.timezones.put("America/Guyana", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Guyana"));
	oFF.TimeZonesConstants.timezones.put("America/Asuncion", oFF.XSimpleTimeZone.createWithUTCMode(-14400000, "America/Asuncion", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 14400000, oFF.DateConstants.MONTH, 4, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("America/Lima", oFF.XSimpleTimeZone.createWithOffsetAndId(-18000000, "America/Lima"));
	oFF.TimeZonesConstants.timezones.put("Atlantic/South_Georgia", oFF.XSimpleTimeZone.createWithOffsetAndId(-7200000, "Atlantic/South_Georgia"));
	oFF.TimeZonesConstants.timezones.put("America/Paramaribo", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Paramaribo"));
	oFF.TimeZonesConstants.timezones.put("America/Port_of_Spain", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Port_of_Spain"));
	oFF.TimeZonesConstants.timezones.put("America/Montevideo", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "America/Montevideo"));
	oFF.TimeZonesConstants.timezones.put("America/Caracas", oFF.XSimpleTimeZone.createWithOffsetAndId(-14400000, "America/Caracas"));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Rothera", oFF.XSimpleTimeZone.createWithOffsetAndId(-10800000, "Antarctica/Rothera"));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Syowa", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Antarctica/Syowa"));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Mawson", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Antarctica/Mawson"));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Vostok", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Antarctica/Vostok"));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Casey", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Antarctica/Casey"));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Davis", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Antarctica/Davis"));
	oFF.TimeZonesConstants.timezones.put("Antarctica/DumontDUrville", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Antarctica/DumontDUrville"));
	oFF.TimeZonesConstants.timezones.put("Asia/Nicosia", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Asia/Nicosia", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Famagusta", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Asia/Famagusta", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Jerusalem", oFF.XSimpleTimeZone.createWithoutMode(7200000, "Asia/Jerusalem", oFF.DateConstants.MARCH, 4, oFF.DateConstants.FRIDAY, 7200000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 7200000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Amman", oFF.XSimpleTimeZone.createWithoutMode(7200000, "Asia/Amman", oFF.DateConstants.MARCH, -1, oFF.DateConstants.FRIDAY, 0, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.FRIDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Beirut", oFF.XSimpleTimeZone.createWithoutMode(7200000, "Asia/Beirut", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 0, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 0, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Gaza", oFF.XSimpleTimeZone.createWithoutMode(7200000, "Asia/Gaza", oFF.DateConstants.MARCH, -1, oFF.DateConstants.FRIDAY, 0, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SATURDAY, 0, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Hebron", oFF.XSimpleTimeZone.createWithoutMode(7200000, "Asia/Hebron", oFF.DateConstants.MARCH, -1, oFF.DateConstants.FRIDAY, 0, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SATURDAY, 0, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Damascus", oFF.XSimpleTimeZone.createWithoutMode(7200000, "Asia/Damascus", oFF.DateConstants.MARCH, -1, oFF.DateConstants.FRIDAY, 0, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.FRIDAY, 0, 3600000));
	oFF.TimeZonesConstants.timezones.put("Asia/Baghdad", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Asia/Baghdad"));
	oFF.TimeZonesConstants.timezones.put("Asia/Qatar", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Asia/Qatar"));
	oFF.TimeZonesConstants.timezones.put("Asia/Riyadh", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Asia/Riyadh"));
	oFF.TimeZonesConstants.timezones.put("Asia/Yerevan", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Asia/Yerevan"));
	oFF.TimeZonesConstants.timezones.put("Asia/Baku", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Asia/Baku"));
	oFF.TimeZonesConstants.timezones.put("Asia/Tbilisi", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Asia/Tbilisi"));
	oFF.TimeZonesConstants.timezones.put("Asia/Dubai", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Asia/Dubai"));
	oFF.TimeZonesConstants.timezones.put("Asia/Kabul", oFF.XSimpleTimeZone.createWithOffsetAndId(16200000, "Asia/Kabul"));
	oFF.TimeZonesConstants.timezones.put("Indian/Maldives", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Indian/Maldives"));
	oFF.TimeZonesConstants.timezones.put("Asia/Karachi", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Karachi"));
	oFF.TimeZonesConstants.timezones.put("Asia/Dushanbe", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Dushanbe"));
	oFF.TimeZonesConstants.timezones.put("Asia/Ashgabat", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Ashgabat"));
	oFF.TimeZonesConstants.timezones.put("Asia/Samarkand", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Samarkand"));
	oFF.TimeZonesConstants.timezones.put("Asia/Tashkent", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Tashkent"));
	oFF.TimeZonesConstants.timezones.put("Asia/Kolkata", oFF.XSimpleTimeZone.createWithOffsetAndId(19800000, "Asia/Kolkata"));
	oFF.TimeZonesConstants.timezones.put("Asia/Colombo", oFF.XSimpleTimeZone.createWithOffsetAndId(19800000, "Asia/Colombo"));
	oFF.TimeZonesConstants.timezones.put("Asia/Kathmandu", oFF.XSimpleTimeZone.createWithOffsetAndId(20700000, "Asia/Kathmandu"));
	oFF.TimeZonesConstants.timezones.put("Asia/Dhaka", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Asia/Dhaka"));
	oFF.TimeZonesConstants.timezones.put("Asia/Thimphu", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Asia/Thimphu"));
	oFF.TimeZonesConstants.timezones.put("Indian/Chagos", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Indian/Chagos"));
	oFF.TimeZonesConstants.timezones.put("Asia/Bishkek", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Asia/Bishkek"));
	oFF.TimeZonesConstants.timezones.put("Asia/Yangon", oFF.XSimpleTimeZone.createWithOffsetAndId(23400000, "Asia/Yangon"));
	oFF.TimeZonesConstants.timezones.put("Asia/Bangkok", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Bangkok"));
	oFF.TimeZonesConstants.timezones.put("Asia/Ho_Chi_Minh", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Ho_Chi_Minh"));
	oFF.TimeZonesConstants.timezones.put("Asia/Brunei", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Brunei"));
	oFF.TimeZonesConstants.timezones.put("Asia/Kuala_Lumpur", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Kuala_Lumpur"));
	oFF.TimeZonesConstants.timezones.put("Asia/Kuching", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Kuching"));
	oFF.TimeZonesConstants.timezones.put("Asia/Manila", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Manila"));
	oFF.TimeZonesConstants.timezones.put("Asia/Singapore", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Singapore"));
	oFF.TimeZonesConstants.timezones.put("Asia/Dili", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Dili"));
	oFF.TimeZonesConstants.timezones.put("Asia/Tokyo", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Tokyo"));
	oFF.TimeZonesConstants.timezones.put("Asia/Seoul", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Seoul"));
	oFF.TimeZonesConstants.timezones.put("Asia/Pyongyang", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Pyongyang"));
	oFF.TimeZonesConstants.timezones.put("Asia/Urumqi", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Asia/Urumqi"));
	oFF.TimeZonesConstants.timezones.put("Asia/Shanghai", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Shanghai"));
	oFF.TimeZonesConstants.timezones.put("Asia/Hong_Kong", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Hong_Kong"));
	oFF.TimeZonesConstants.timezones.put("Asia/Taipei", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Taipei"));
	oFF.TimeZonesConstants.timezones.put("Asia/Macau", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Macau"));
	oFF.TimeZonesConstants.timezones.put("Asia/Jakarta", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Jakarta"));
	oFF.TimeZonesConstants.timezones.put("Asia/Pontianak", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Pontianak"));
	oFF.TimeZonesConstants.timezones.put("Asia/Makassar", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Makassar"));
	oFF.TimeZonesConstants.timezones.put("Asia/Jayapura", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Jayapura"));
	oFF.TimeZonesConstants.timezones.put("Asia/Qyzylorda", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Qyzylorda"));
	oFF.TimeZonesConstants.timezones.put("Asia/Aqtobe", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Aqtobe"));
	oFF.TimeZonesConstants.timezones.put("Asia/Aqtau", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Aqtau"));
	oFF.TimeZonesConstants.timezones.put("Asia/Atyrau", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Atyrau"));
	oFF.TimeZonesConstants.timezones.put("Asia/Oral", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Oral"));
	oFF.TimeZonesConstants.timezones.put("Asia/Almaty", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Asia/Almaty"));
	oFF.TimeZonesConstants.timezones.put("Asia/Qostanay", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Asia/Qostanay"));
	oFF.TimeZonesConstants.timezones.put("Asia/Hovd", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Hovd"));
	oFF.TimeZonesConstants.timezones.put("Asia/Ulaanbaatar", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Ulaanbaatar"));
	oFF.TimeZonesConstants.timezones.put("Asia/Choibalsan", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Choibalsan"));
	oFF.TimeZonesConstants.timezones.put("Australia/Perth", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Australia/Perth"));
	oFF.TimeZonesConstants.timezones.put("Australia/Eucla", oFF.XSimpleTimeZone.createWithOffsetAndId(31500000, "Australia/Eucla"));
	oFF.TimeZonesConstants.timezones.put("Australia/Darwin", oFF.XSimpleTimeZone.createWithOffsetAndId(34200000, "Australia/Darwin"));
	oFF.TimeZonesConstants.timezones.put("Australia/Adelaide", oFF.XSimpleTimeZone.createWithoutMode(34200000, "Australia/Adelaide", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Australia/Broken_Hill", oFF.XSimpleTimeZone.createWithoutMode(34200000, "Australia/Broken_Hill", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Australia/Brisbane", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Australia/Brisbane"));
	oFF.TimeZonesConstants.timezones.put("Australia/Lindeman", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Australia/Lindeman"));
	oFF.TimeZonesConstants.timezones.put("Australia/Hobart", oFF.XSimpleTimeZone.createWithoutMode(36000000, "Australia/Hobart", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Australia/Currie", oFF.XSimpleTimeZone.createWithoutMode(36000000, "Australia/Currie", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Australia/Melbourne", oFF.XSimpleTimeZone.createWithoutMode(36000000, "Australia/Melbourne", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Australia/Sydney", oFF.XSimpleTimeZone.createWithoutMode(36000000, "Australia/Sydney", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Australia/Lord_Howe", oFF.XSimpleTimeZone.createWithoutMode(37800000, "Australia/Lord_Howe", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 7200000, 1800000));
	oFF.TimeZonesConstants.timezones.put("Pacific/Pago_Pago", oFF.XSimpleTimeZone.createWithOffsetAndId(-39600000, "Pacific/Pago_Pago"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Niue", oFF.XSimpleTimeZone.createWithOffsetAndId(-39600000, "Pacific/Niue"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Pitcairn", oFF.XSimpleTimeZone.createWithOffsetAndId(-28800000, "Pacific/Pitcairn"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Gambier", oFF.XSimpleTimeZone.createWithOffsetAndId(-32400000, "Pacific/Gambier"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Marquesas", oFF.XSimpleTimeZone.createWithOffsetAndId(-34200000, "Pacific/Marquesas"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Tahiti", oFF.XSimpleTimeZone.createWithOffsetAndId(-36000000, "Pacific/Tahiti"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Rarotonga", oFF.XSimpleTimeZone.createWithOffsetAndId(-36000000, "Pacific/Rarotonga"));
	oFF.TimeZonesConstants.timezones.put("Indian/Cocos", oFF.XSimpleTimeZone.createWithOffsetAndId(23400000, "Indian/Cocos"));
	oFF.TimeZonesConstants.timezones.put("Indian/Christmas", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Indian/Christmas"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Palau", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Pacific/Palau"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Guam", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Pacific/Guam"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Chuuk", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Pacific/Chuuk"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Port_Moresby", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Pacific/Port_Moresby"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Norfolk", oFF.XSimpleTimeZone.createWithoutMode(39600000, "Pacific/Norfolk", oFF.DateConstants.OCTOBER, 1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Antarctica/Macquarie", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Antarctica/Macquarie"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Pohnpei", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Pacific/Pohnpei"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Kosrae", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Pacific/Kosrae"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Noumea", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Pacific/Noumea"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Bougainville", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Pacific/Bougainville"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Guadalcanal", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Pacific/Guadalcanal"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Efate", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Pacific/Efate"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Tarawa", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Pacific/Tarawa"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Majuro", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Pacific/Majuro"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Kwajalein", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Pacific/Kwajalein"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Nauru", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Pacific/Nauru"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Funafuti", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Pacific/Funafuti"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Wake", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Pacific/Wake"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Wallis", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Pacific/Wallis"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Fiji", oFF.XSimpleTimeZone.createWithoutMode(43200000, "Pacific/Fiji", oFF.DateConstants.NOVEMBER, 2, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.JANUARY, 2, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Pacific/Enderbury", oFF.XSimpleTimeZone.createWithOffsetAndId(46800000, "Pacific/Enderbury"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Fakaofo", oFF.XSimpleTimeZone.createWithOffsetAndId(46800000, "Pacific/Fakaofo"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Tongatapu", oFF.XSimpleTimeZone.createWithOffsetAndId(46800000, "Pacific/Tongatapu"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Apia", oFF.XSimpleTimeZone.createWithUTCMode(46800000, "Pacific/Apia", oFF.DateConstants.SEPTEMBER, -1, oFF.DateConstants.SUNDAY, 10800000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 14400000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Pacific/Kiritimati", oFF.XSimpleTimeZone.createWithOffsetAndId(50400000, "Pacific/Kiritimati"));
	oFF.TimeZonesConstants.timezones.put("Pacific/Auckland", oFF.XSimpleTimeZone.createWithoutMode(43200000, "Pacific/Auckland", oFF.DateConstants.SEPTEMBER, -1, oFF.DateConstants.SUNDAY, 7200000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 10800000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Pacific/Chatham", oFF.XSimpleTimeZone.createWithoutMode(45900000, "Pacific/Chatham", oFF.DateConstants.SEPTEMBER, -1, oFF.DateConstants.SUNDAY, 9900000, oFF.DateConstants.APRIL, 1, oFF.DateConstants.SUNDAY, 13500000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Atlantic/Reykjavik", oFF.XSimpleTimeZone.createWithOffsetAndId(0, "Atlantic/Reykjavik"));
	oFF.TimeZonesConstants.timezones.put("Atlantic/Azores", oFF.XSimpleTimeZone.createWithUTCMode(-3600000, "Atlantic/Azores", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Atlantic/Madeira", oFF.XSimpleTimeZone.createWithUTCMode(0, "Atlantic/Madeira", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Lisbon", oFF.XSimpleTimeZone.createWithUTCMode(0, "Europe/Lisbon", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/London", oFF.XSimpleTimeZone.createWithUTCMode(0, "Europe/London", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Dublin", oFF.XSimpleTimeZone.createWithUTCMode(0, "Europe/Dublin", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Atlantic/Canary", oFF.XSimpleTimeZone.createWithUTCMode(0, "Atlantic/Canary", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Atlantic/Faroe", oFF.XSimpleTimeZone.createWithUTCMode(0, "Atlantic/Faroe", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Berlin", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Berlin", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Paris", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Paris", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Budapest", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Budapest", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Rome", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Rome", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Luxembourg", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Luxembourg", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Malta", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Malta", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Monaco", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Monaco", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Amsterdam", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Amsterdam", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Oslo", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Oslo", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Warsaw", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Warsaw", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Belgrade", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Belgrade", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Ljubljana", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Ljubljana", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Podgorica", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Podgorica", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Sarajevo", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Sarajevo", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Skopje", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Skopje", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Zagreb", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Zagreb", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Prague", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Prague", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Bratislava", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Bratislava", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Madrid", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Madrid", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Gibraltar", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Gibraltar", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Stockholm", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Stockholm", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Zurich", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Zurich", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Uzhgorod", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Uzhgorod", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Zaporozhye", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Zaporozhye", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Kiev", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Kiev", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Tirane", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Tirane", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Andorra", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Andorra", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Vienna", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Vienna", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Brussels", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Brussels", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Copenhagen", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Europe/Copenhagen", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Africa/Ceuta", oFF.XSimpleTimeZone.createWithUTCMode(3600000, "Africa/Ceuta", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 360000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Riga", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Europe/Riga", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Athens", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Europe/Athens", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Vilnius", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Europe/Vilnius", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Tallinn", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Europe/Tallinn", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Bucharest", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Europe/Bucharest", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Sofia", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Europe/Sofia", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Helsinki", oFF.XSimpleTimeZone.createWithUTCMode(7200000, "Europe/Helsinki", oFF.DateConstants.MARCH, -1, oFF.DateConstants.SUNDAY, 3600000, oFF.DateConstants.OCTOBER, -1, oFF.DateConstants.SUNDAY, 3600000, 3600000));
	oFF.TimeZonesConstants.timezones.put("Europe/Istanbul", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Europe/Istanbul"));
	oFF.TimeZonesConstants.timezones.put("Europe/Kaliningrad", oFF.XSimpleTimeZone.createWithOffsetAndId(7200000, "Europe/Kaliningrad"));
	oFF.TimeZonesConstants.timezones.put("Europe/Simferopol", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Europe/Simferopol"));
	oFF.TimeZonesConstants.timezones.put("Europe/Moscow", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Europe/Moscow"));
	oFF.TimeZonesConstants.timezones.put("Europe/Kirov", oFF.XSimpleTimeZone.createWithOffsetAndId(10800000, "Europe/Kirov"));
	oFF.TimeZonesConstants.timezones.put("Europe/Astrakhan", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Europe/Astrakhan"));
	oFF.TimeZonesConstants.timezones.put("Europe/Volgograd", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Europe/Volgograd"));
	oFF.TimeZonesConstants.timezones.put("Europe/Saratov", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Europe/Saratov"));
	oFF.TimeZonesConstants.timezones.put("Europe/Samara", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Europe/Samara"));
	oFF.TimeZonesConstants.timezones.put("Europe/Ulyanovsk", oFF.XSimpleTimeZone.createWithOffsetAndId(14400000, "Europe/Ulyanovsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Yekaterinburg", oFF.XSimpleTimeZone.createWithOffsetAndId(18000000, "Asia/Yekaterinburg"));
	oFF.TimeZonesConstants.timezones.put("Asia/Omsk", oFF.XSimpleTimeZone.createWithOffsetAndId(21600000, "Asia/Omsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Barnaul", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Barnaul"));
	oFF.TimeZonesConstants.timezones.put("Asia/Novosibirsk", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Novosibirsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Tomsk", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Tomsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Novokuznetsk", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Novokuznetsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Krasnoyarsk", oFF.XSimpleTimeZone.createWithOffsetAndId(25200000, "Asia/Krasnoyarsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Irkutsk", oFF.XSimpleTimeZone.createWithOffsetAndId(28800000, "Asia/Irkutsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Chita", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Chita"));
	oFF.TimeZonesConstants.timezones.put("Asia/Yakutsk", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Yakutsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Khandyga", oFF.XSimpleTimeZone.createWithOffsetAndId(32400000, "Asia/Khandyga"));
	oFF.TimeZonesConstants.timezones.put("Asia/Vladivostok", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Asia/Vladivostok"));
	oFF.TimeZonesConstants.timezones.put("Asia/Ust-Nera", oFF.XSimpleTimeZone.createWithOffsetAndId(36000000, "Asia/Ust-Nera"));
	oFF.TimeZonesConstants.timezones.put("Asia/Sakhalin", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Asia/Sakhalin"));
	oFF.TimeZonesConstants.timezones.put("Asia/Magadan", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Asia/Magadan"));
	oFF.TimeZonesConstants.timezones.put("Asia/Srednekolymsk", oFF.XSimpleTimeZone.createWithOffsetAndId(39600000, "Asia/Srednekolymsk"));
	oFF.TimeZonesConstants.timezones.put("Asia/Kamchatka", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Asia/Kamchatka"));
	oFF.TimeZonesConstants.timezones.put("Asia/Anadyr", oFF.XSimpleTimeZone.createWithOffsetAndId(43200000, "Asia/Anadyr"));
};

oFF.XAbstractCalendarDate = function() {};
oFF.XAbstractCalendarDate.prototype = new oFF.XAbstractValue();
oFF.XAbstractCalendarDate.prototype._ff_c = "XAbstractCalendarDate";

oFF.XAbstractCalendarDate.BASE_YEAR = 1970;
oFF.XAbstractCalendarDate.floorDivide = function(numerator, denominator)
{
	if (numerator >= 0)
	{
		return oFF.XMath.div(numerator, denominator);
	}
	return oFF.XMath.div(numerator + 1, denominator) - 1;
};
oFF.XAbstractCalendarDate.longFloorDivide = function(numerator, denominator)
{
	if (numerator >= 0)
	{
		return oFF.XMath.longDiv(numerator, denominator);
	}
	return oFF.XMath.longDiv(numerator + 1, denominator) - 1;
};
oFF.XAbstractCalendarDate.longModFloor = function(x, y)
{
	return x - y * oFF.XAbstractCalendarDate.longFloorDivide(x, y);
};
oFF.XAbstractCalendarDate.modFloor = function(x, y)
{
	return x - y * oFF.XAbstractCalendarDate.floorDivide(x, y);
};
oFF.XAbstractCalendarDate.prototype.m_normalized = false;
oFF.XAbstractCalendarDate.prototype.getDayOfWeekFromFixedDate = function(fixedDate)
{
	if (fixedDate >= 0)
	{
		return oFF.XLong.convertToInt(oFF.XMath.longMod(fixedDate, 7) + oFF.DateConstants.SUNDAY);
	}
	return oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longModFloor(fixedDate, 7) + oFF.DateConstants.SUNDAY);
};
oFF.XAbstractCalendarDate.prototype.getFixedDate = function()
{
	if (!this.isNormalized())
	{
		this.normalizeMonth();
	}
	return this.getFixedDateWithYearMonthDay(this.getYear(), this.getMonthOfYear(), this.getDayOfMonth());
};
oFF.XAbstractCalendarDate.prototype.getFixedDateWithYearMonthDay = function(year, month, dayOfMonth)
{
	let isJan1 = month === oFF.DateConstants.JANUARY && dayOfMonth === 1;
	let gcal = oFF.XGregorianCalendar.create();
	let n = year - oFF.XAbstractCalendarDate.BASE_YEAR;
	if (n >= 0 && n < oFF.DateConstants.FIXED_DATES.size())
	{
		let jan1 = oFF.DateConstants.FIXED_DATES.get(n);
		if (isJan1)
		{
			return jan1;
		}
		else
		{
			return jan1 + gcal.getDayOfYear(year, month, dayOfMonth) - 1;
		}
	}
	let prevYear = year - 1;
	let days = dayOfMonth;
	if (prevYear >= 0)
	{
		days = days + 365 * prevYear + oFF.XMath.longDiv(prevYear, 4) - oFF.XMath.longDiv(prevYear, 100) + oFF.XMath.longDiv(prevYear, 400) + oFF.XMath.longDiv(367 * month - 362, 12);
	}
	else
	{
		days = days + 365 * prevYear + oFF.XAbstractCalendarDate.longFloorDivide(prevYear, 4) - oFF.XAbstractCalendarDate.longFloorDivide(prevYear, 100) + oFF.XAbstractCalendarDate.longFloorDivide(prevYear, 400) + oFF.XAbstractCalendarDate.longFloorDivide(367 * month - 362, 12);
	}
	if (month > oFF.DateConstants.FEBRUARY)
	{
		if (gcal.isLeapYear(year))
		{
			days = days - 1;
		}
		else
		{
			days = days - 2;
		}
	}
	return days;
};
oFF.XAbstractCalendarDate.prototype.isNormalized = function()
{
	return this.m_normalized;
};
oFF.XAbstractCalendarDate.prototype.normalize = function()
{
	if (!this.isNormalized())
	{
		let days = this.getNormalizedTime();
		this.normalizeMonth();
		let d = this.getDayOfMonth() + days;
		let m = this.getMonthOfYear();
		let y = this.getYear();
		let gcal = oFF.XGregorianCalendar.create();
		let ml = gcal.getDaysInMonth(y, m);
		if (!(d > 0 && d <= ml))
		{
			if (d <= 0 && d > -28)
			{
				m = m - 1;
				ml = gcal.getDaysInMonth(y, m);
				d = d + ml;
				this.setDayOfMonth(oFF.XLong.convertToInt(d));
				if (m === 0)
				{
					m = oFF.DateConstants.DECEMBER;
					this.setYear(y - 1);
				}
				this.setMonthOfYear(m);
			}
			else if (d > ml && d < ml + 28)
			{
				d = d - ml;
				m = m + 1;
				this.setDayOfMonth(oFF.XLong.convertToInt(d));
				if (m > oFF.DateConstants.DECEMBER)
				{
					this.setYear(y + 1);
					m = oFF.DateConstants.JANUARY;
				}
				this.setMonthOfYear(m);
			}
			else
			{
				let fixedDate = d + this.getFixedDateWithYearMonthDay(y, m, 1) - 1;
				this.dateFromFixedDate(fixedDate);
			}
		}
		else
		{
			this.setDayOfWeek(oFF.XLong.convertToInt(this.getDayOfWeekFromFixedDate(this.getFixedDate())));
		}
		this.setLeapYear(gcal.isLeapYear(this.getYear()));
		this.setDaylightSavingInMilliseconds(0);
	}
	return true;
};
oFF.XAbstractCalendarDate.prototype.setNormalized = function(normalized)
{
	this.m_normalized = normalized;
};

oFF.XEmptyDate = function() {};
oFF.XEmptyDate.prototype = new oFF.XAbstractValue();
oFF.XEmptyDate.prototype._ff_c = "XEmptyDate";

oFF.XEmptyDate.create = function()
{
	return new oFF.XEmptyDate();
};
oFF.XEmptyDate.prototype.addDaysOfMonth = oFF.noSupport;
oFF.XEmptyDate.prototype.addMonths = oFF.noSupport;
oFF.XEmptyDate.prototype.addYears = oFF.noSupport;
oFF.XEmptyDate.prototype.cloneExt = function(flags)
{
	return new oFF.XEmptyDate();
};
oFF.XEmptyDate.prototype.dateFromFixedDate = oFF.noSupport;
oFF.XEmptyDate.prototype.difference = oFF.noSupport;
oFF.XEmptyDate.prototype.getDayOfMonth = oFF.noSupport;
oFF.XEmptyDate.prototype.getDayOfWeek = oFF.noSupport;
oFF.XEmptyDate.prototype.getDaylightSavingInMilliseconds = oFF.noSupport;
oFF.XEmptyDate.prototype.getEra = oFF.noSupport;
oFF.XEmptyDate.prototype.getMilliseconds = oFF.noSupport;
oFF.XEmptyDate.prototype.getMonthOfYear = oFF.noSupport;
oFF.XEmptyDate.prototype.getQuarterOfYear = oFF.noSupport;
oFF.XEmptyDate.prototype.getTimeZone = oFF.noSupport;
oFF.XEmptyDate.prototype.getTimeZoneOffsetInMilliseconds = oFF.noSupport;
oFF.XEmptyDate.prototype.getValueType = function()
{
	return oFF.XValueType.DATE;
};
oFF.XEmptyDate.prototype.getYear = oFF.noSupport;
oFF.XEmptyDate.prototype.isDaylightTime = oFF.noSupport;
oFF.XEmptyDate.prototype.isLeapYear = oFF.noSupport;
oFF.XEmptyDate.prototype.isStandardTime = oFF.noSupport;
oFF.XEmptyDate.prototype.normalize = oFF.noSupport;
oFF.XEmptyDate.prototype.setDate = oFF.noSupport;
oFF.XEmptyDate.prototype.setDayOfMonth = oFF.noSupport;
oFF.XEmptyDate.prototype.setDayOfWeek = oFF.noSupport;
oFF.XEmptyDate.prototype.setDaylightSavingInMilliseconds = oFF.noSupport;
oFF.XEmptyDate.prototype.setEra = oFF.noSupport;
oFF.XEmptyDate.prototype.setLeapYear = oFF.noSupport;
oFF.XEmptyDate.prototype.setMonthOfYear = oFF.noSupport;
oFF.XEmptyDate.prototype.setTimeZone = oFF.noSupport;
oFF.XEmptyDate.prototype.setYear = oFF.noSupport;
oFF.XEmptyDate.prototype.toIsoFormat = function()
{
	return "";
};
oFF.XEmptyDate.prototype.toSAPFormat = function()
{
	return "";
};
oFF.XEmptyDate.prototype.toString = function()
{
	return this.toIsoFormat();
};

oFF.XEmptyTime = function() {};
oFF.XEmptyTime.prototype = new oFF.XAbstractValue();
oFF.XEmptyTime.prototype._ff_c = "XEmptyTime";

oFF.XEmptyTime.create = function()
{
	return new oFF.XEmptyTime();
};
oFF.XEmptyTime.prototype.addHours = oFF.noSupport;
oFF.XEmptyTime.prototype.addMilliseconds = oFF.noSupport;
oFF.XEmptyTime.prototype.addMinutes = oFF.noSupport;
oFF.XEmptyTime.prototype.addSeconds = oFF.noSupport;
oFF.XEmptyTime.prototype.cloneExt = function(flags)
{
	return new oFF.XEmptyTime();
};
oFF.XEmptyTime.prototype.getFractionsOfSecond = oFF.noSupport;
oFF.XEmptyTime.prototype.getHourOfDay = oFF.noSupport;
oFF.XEmptyTime.prototype.getMillisecondOfSecond = oFF.noSupport;
oFF.XEmptyTime.prototype.getMinuteOfHour = oFF.noSupport;
oFF.XEmptyTime.prototype.getSecondOfMinute = oFF.noSupport;
oFF.XEmptyTime.prototype.getTimeInMilliseconds = oFF.noSupport;
oFF.XEmptyTime.prototype.getValueType = function()
{
	return oFF.XValueType.TIME;
};
oFF.XEmptyTime.prototype.normalizeTime = oFF.noSupport;
oFF.XEmptyTime.prototype.setFraction = oFF.noSupport;
oFF.XEmptyTime.prototype.setHourOfDay = oFF.noSupport;
oFF.XEmptyTime.prototype.setMillisecondOfSecond = oFF.noSupport;
oFF.XEmptyTime.prototype.setMinuteOfHour = oFF.noSupport;
oFF.XEmptyTime.prototype.setSecondOfMinute = oFF.noSupport;
oFF.XEmptyTime.prototype.toIsoFormat = function()
{
	return "";
};
oFF.XEmptyTime.prototype.toIsoFormatWithFractions = oFF.noSupport;
oFF.XEmptyTime.prototype.toSAPFormat = function()
{
	return "";
};
oFF.XEmptyTime.prototype.toString = function()
{
	return this.toIsoFormat();
};

oFF.XTime = function() {};
oFF.XTime.prototype = new oFF.XAbstractValue();
oFF.XTime.prototype._ff_c = "XTime";

oFF.XTime.FRACTIONS_MAX_SIZE = 7;
oFF.XTime.FRACTIONS_MAX_VALUE = 9999999;
oFF.XTime.MILLISECOND_MAX_SIZE = 3;
oFF.XTime.TIME_UNDEFINED = -9223372036854775808;
oFF.XTime.createHollowTime = function()
{
	return new oFF.XTime();
};
oFF.XTime.createLocalTime = function()
{
	let timeInMillis = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	return oFF.XTime.createWithMillis(timeInMillis);
};
oFF.XTime.createTimeFromIsoFormat = function(time)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(time))
	{
		let size = oFF.XString.size(time);
		if (size < 8)
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate3("Illegal ISO time format (", time, "). Expected HH:MM:SS.fffffff"));
		}
		let hourString = oFF.XString.substring(time, 0, 2);
		let hour = oFF.XInteger.convertFromStringWithRadix(hourString, 10);
		let minuteString = oFF.XString.substring(time, 3, 5);
		let minute = oFF.XInteger.convertFromStringWithRadix(minuteString, 10);
		let secondString = oFF.XString.substring(time, 6, 8);
		let second = oFF.XInteger.convertFromStringWithRadix(secondString, 10);
		let fractions = 0;
		if (size > 8)
		{
			if (oFF.XString.isEqual(oFF.XString.substring(time, 8, 9), "."))
			{
				fractions = oFF.XTime.extractFractions(time, 9, oFF.XTime.FRACTIONS_MAX_SIZE);
			}
		}
		let fractionsString = oFF.XInteger.convertToString(fractions);
		result = oFF.XTime.createTimeWithFractions(hour, minute, second, fractionsString);
	}
	else if (oFF.notNull(time))
	{
		result = oFF.XEmptyTime.create();
	}
	return result;
};
oFF.XTime.createTimeFromSAPFormat = function(time)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(time))
	{
		if (oFF.XString.size(time) === 6)
		{
			let hourString = oFF.XString.substring(time, 0, 2);
			let hour = oFF.XInteger.convertFromString(hourString);
			let minuteString = oFF.XString.substring(time, 2, 4);
			let minute = oFF.XInteger.convertFromString(minuteString);
			let secondString = oFF.XString.substring(time, 4, 6);
			let second = oFF.XInteger.convertFromString(secondString);
			result = oFF.XTime.createTimeWithValues(hour, minute, second, 0);
		}
		else if (oFF.XString.isEqual("#", time))
		{
			result = oFF.XTime.createHollowTime();
		}
		else
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate3("Illegal SAP time format (", time, "). Expected HHMMSS"));
		}
	}
	return result;
};
oFF.XTime.createTimeFromString = function(time, valueFormat)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(time))
	{
		if (valueFormat === oFF.DateTimeFormat.ISO)
		{
			result = oFF.XTime.createTimeFromIsoFormat(time);
		}
		else if (valueFormat === oFF.DateTimeFormat.SAP)
		{
			result = oFF.XTime.createTimeFromSAPFormat(time);
		}
		else
		{
			let timeLength = oFF.XString.size(time);
			if (timeLength === 8)
			{
				result = oFF.XTime.createTimeFromIsoFormat(time);
			}
			else if (timeLength === 6)
			{
				result = oFF.XTime.createTimeFromSAPFormat(time);
			}
		}
	}
	return result;
};
oFF.XTime.createTimeFromStringWithFlag = function(time, isSapFormat)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(time))
	{
		if (isSapFormat)
		{
			result = oFF.XTime.createTimeFromSAPFormat(time);
		}
		else
		{
			result = oFF.XTime.createTimeFromIsoFormat(time);
		}
	}
	return result;
};
oFF.XTime.createTimeSafe = function(time)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(time))
	{
		let size = oFF.XString.size(time);
		if (size === 6)
		{
			try
			{
				result = oFF.XTime.createTimeFromSAPFormat(time);
			}
			catch (ignored)
			{
				result = null;
			}
		}
		else if (oFF.XString.isEqual("#", time))
		{
			result = oFF.XTime.createHollowTime();
		}
		if (oFF.isNull(result))
		{
			try
			{
				result = oFF.XTime.createTimeFromIsoFormat(time);
			}
			catch (ignored1)
			{
				result = null;
			}
		}
	}
	return result;
};
oFF.XTime.createTimeWithFractions = function(hour, minute, second, secondFractions)
{
	let time = new oFF.XTime();
	time.setHourOfDay(hour);
	time.setMinuteOfHour(minute);
	time.setSecondOfMinute(second);
	let millisecond = 0;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(secondFractions) && oFF.XString.size(secondFractions) >= oFF.XTime.MILLISECOND_MAX_SIZE)
	{
		let fullFractions = oFF.XStringUtils.addNumberPadded(oFF.XInteger.convertFromString(secondFractions), oFF.XTime.FRACTIONS_MAX_SIZE);
		let fullMillis = oFF.XStringUtils.addNumberPadded(oFF.XInteger.convertFromString(oFF.XString.substring(fullFractions, 0, oFF.XTime.MILLISECOND_MAX_SIZE)), oFF.XTime.MILLISECOND_MAX_SIZE);
		millisecond = oFF.XInteger.convertFromString(fullMillis);
	}
	time.setMillisecondOfSecond(millisecond);
	time.setSecondFractions(secondFractions);
	return time;
};
oFF.XTime.createTimeWithValues = function(hour, minute, second, millisecond)
{
	let time = new oFF.XTime();
	time.setHourOfDay(hour);
	time.setMinuteOfHour(minute);
	time.setSecondOfMinute(second);
	time.setMillisecondOfSecond(millisecond);
	return time;
};
oFF.XTime.createWithMillis = function(timeInMillis)
{
	let timezoneOffset = oFF.XSystemUtils.getSystemTimezoneOffsetInMilliseconds();
	let timeZone = oFF.XSimpleTimeZone.createWithOffsetAndId(timezoneOffset, "");
	let calendar = oFF.XGregorianCalendar.createWithTimeZone(timeZone);
	calendar.setTimeInMillis(timeInMillis);
	let hour = calendar.get(oFF.DateConstants.HOUR_OF_DAY);
	let minute = calendar.get(oFF.DateConstants.MINUTE);
	let second = calendar.get(oFF.DateConstants.SECOND);
	let millisecond = calendar.get(oFF.DateConstants.MILLISECOND);
	return oFF.XTime.createTimeWithValues(hour, minute, second, millisecond);
};
oFF.XTime.extractFractions = function(time, positionOfFirstFraction, desiredFractionSize)
{
	let fractions = 0;
	let tSize = oFF.XString.size(time);
	if (tSize > positionOfFirstFraction)
	{
		let exponent = desiredFractionSize - 1;
		for (let i = positionOfFirstFraction; i < tSize; i++)
		{
			if (exponent < 0)
			{
				break;
			}
			let newFraction = oFF.XInteger.convertFromStringWithDefault(oFF.XString.substring(time, i, i + 1), -1);
			if (newFraction > -1)
			{
				fractions = oFF.XDouble.convertToInt(fractions + oFF.XMath.pow(10, exponent) * newFraction);
				exponent = exponent - 1;
			}
		}
	}
	return fractions;
};
oFF.XTime.floorDivide = function(numerator, denominator)
{
	if (numerator >= 0)
	{
		return oFF.XMath.longDiv(numerator, denominator);
	}
	return oFF.XMath.longDiv(numerator + 1, denominator) - 1;
};
oFF.XTime.prototype.m_fraction = 0;
oFF.XTime.prototype.m_hour = 0;
oFF.XTime.prototype.m_millisecond = 0;
oFF.XTime.prototype.m_millisecondsFractionStringRepresentation = null;
oFF.XTime.prototype.m_minute = 0;
oFF.XTime.prototype.m_normalized = false;
oFF.XTime.prototype.m_second = 0;
oFF.XTime.prototype.addHours = function(hoursToAdd)
{
	if (hoursToAdd !== 0)
	{
		this.m_hour = this.m_hour + hoursToAdd;
		this.m_normalized = false;
	}
};
oFF.XTime.prototype.addMilliseconds = function(millisToAdd)
{
	if (millisToAdd !== 0)
	{
		this.m_millisecond = this.m_millisecond + millisToAdd;
		this.m_normalized = false;
	}
};
oFF.XTime.prototype.addMinutes = function(minutesToAdd)
{
	if (minutesToAdd !== 0)
	{
		this.m_minute = this.m_minute + minutesToAdd;
		this.m_normalized = false;
	}
};
oFF.XTime.prototype.addSeconds = function(secondsToAdd)
{
	if (secondsToAdd !== 0)
	{
		this.m_second = this.m_second + secondsToAdd;
		this.m_normalized = false;
	}
};
oFF.XTime.prototype.cloneExt = function(flags)
{
	return oFF.XTime.createTimeWithFractions(this.m_hour, this.m_minute, this.m_second, this.m_millisecondsFractionStringRepresentation);
};
oFF.XTime.prototype.create = function()
{
	return oFF.XTime.createLocalTime();
};
oFF.XTime.prototype.getFractionsOfSecond = function()
{
	return this.m_millisecondsFractionStringRepresentation;
};
oFF.XTime.prototype.getHourOfDay = function()
{
	return this.m_hour;
};
oFF.XTime.prototype.getMillisecondOfSecond = function()
{
	return this.m_millisecond;
};
oFF.XTime.prototype.getMinuteOfHour = function()
{
	return this.m_minute;
};
oFF.XTime.prototype.getNormalizedTimeOfDay = function()
{
	let fraction = this.getTimeOfDay();
	if (fraction !== oFF.XTime.TIME_UNDEFINED)
	{
		return fraction;
	}
	fraction = this.getTimeOfDayValue();
	this.setFraction(fraction);
	return fraction;
};
oFF.XTime.prototype.getSecondOfMinute = function()
{
	return this.m_second;
};
oFF.XTime.prototype.getTimeInMilliseconds = function()
{
	let fraction = this.getTimeOfDay();
	if (fraction !== oFF.XTime.TIME_UNDEFINED)
	{
		return fraction;
	}
	fraction = this.getTimeOfDayValue();
	this.setFraction(fraction);
	return fraction;
};
oFF.XTime.prototype.getTimeOfDay = function()
{
	if (!this.m_normalized)
	{
		this.m_fraction = oFF.XTime.TIME_UNDEFINED;
		return this.m_fraction;
	}
	return this.m_fraction;
};
oFF.XTime.prototype.getTimeOfDayValue = function()
{
	let fraction = this.getHourOfDay();
	fraction = fraction * 60;
	fraction = fraction + this.getMinuteOfHour();
	fraction = fraction * 60;
	fraction = fraction + this.getSecondOfMinute();
	fraction = fraction * 1000;
	fraction = fraction + this.getMillisecondOfSecond();
	return fraction;
};
oFF.XTime.prototype.getValueType = function()
{
	return oFF.XValueType.TIME;
};
oFF.XTime.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return this.m_hour === otherValue.m_hour && this.m_minute === otherValue.m_minute && this.m_second === otherValue.m_second && this.m_millisecond === otherValue.m_millisecond && oFF.XString.isEqual(this.m_millisecondsFractionStringRepresentation, this.m_millisecondsFractionStringRepresentation);
};
oFF.XTime.prototype.normalizeTime = function()
{
	let fraction = this.getNormalizedTimeOfDay();
	let days = 0;
	if (fraction >= oFF.DateConstants.DAY_IN_MILLIS)
	{
		days = oFF.XMath.longDiv(fraction, oFF.DateConstants.DAY_IN_MILLIS);
		fraction = oFF.XMath.longMod(fraction, oFF.DateConstants.DAY_IN_MILLIS);
	}
	else if (fraction < 0)
	{
		days = oFF.XTime.floorDivide(fraction, oFF.DateConstants.DAY_IN_MILLIS);
		if (days !== 0)
		{
			fraction = fraction - oFF.DateConstants.DAY_IN_MILLIS * days;
		}
	}
	if (days !== 0)
	{
		this.setFraction(fraction);
	}
	this.setMillisecondOfSecond(oFF.XLong.convertToInt(oFF.XMath.longMod(fraction, 1000)));
	fraction = oFF.XMath.longDiv(fraction, 1000);
	this.setSecondOfMinute(oFF.XLong.convertToInt(oFF.XMath.longMod(fraction, 60)));
	fraction = oFF.XMath.longDiv(fraction, 60);
	this.setMinuteOfHour(oFF.XLong.convertToInt(oFF.XMath.longMod(fraction, 60)));
	this.setHourOfDay(oFF.XLong.convertToInt(oFF.XMath.longDiv(fraction, 60)));
	return oFF.XLong.convertToInt(days);
};
oFF.XTime.prototype.releaseObject = function()
{
	this.m_millisecondsFractionStringRepresentation = null;
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.XTime.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this !== value)
	{
		let otherValue = value;
		this.setHourOfDay(otherValue.m_hour);
		this.setMinuteOfHour(otherValue.m_minute);
		this.setSecondOfMinute(otherValue.m_second);
		this.setMillisecondOfSecond(otherValue.m_millisecond);
	}
};
oFF.XTime.prototype.setFraction = function(fraction)
{
	this.m_fraction = fraction;
};
oFF.XTime.prototype.setHourOfDay = function(hour)
{
	if (this.m_hour !== hour)
	{
		this.m_hour = hour;
		this.m_normalized = false;
	}
};
oFF.XTime.prototype.setMillisecondOfSecond = function(millisecond)
{
	this.m_millisecond = millisecond;
	this.updateFractionsOnMillisChange();
	this.m_normalized = false;
};
oFF.XTime.prototype.setMinuteOfHour = function(minute)
{
	if (this.m_minute !== minute)
	{
		this.m_minute = minute;
		this.m_normalized = false;
	}
};
oFF.XTime.prototype.setSecondFractions = function(fractions)
{
	let fractionsValueAsInt = 0;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fractions))
	{
		let fractionSize = oFF.XString.size(fractions);
		fractionsValueAsInt = oFF.XInteger.convertFromString(fractions);
		if (fractionsValueAsInt < 0 || fractionsValueAsInt > oFF.XTime.FRACTIONS_MAX_VALUE || fractionSize > oFF.XTime.FRACTIONS_MAX_SIZE)
		{
			throw oFF.XException.createIllegalArgumentException("Illegal fractions of second");
		}
	}
	this.m_millisecondsFractionStringRepresentation = oFF.XStringUtils.addNumberPadded(fractionsValueAsInt, oFF.XTime.FRACTIONS_MAX_SIZE);
};
oFF.XTime.prototype.setSecondOfMinute = function(second)
{
	if (this.m_second !== second)
	{
		this.m_second = second;
		this.m_normalized = false;
	}
};
oFF.XTime.prototype.toIsoFormat = function()
{
	return this.toIsoFormatWithFractions(oFF.XTime.FRACTIONS_MAX_SIZE);
};
oFF.XTime.prototype.toIsoFormatWithFractions = function(fractionSize)
{
	if (fractionSize < 0)
	{
		throw oFF.XException.createIllegalArgumentException("Illegal fraction size.");
	}
	let buffer = oFF.XStringBuffer.create();
	buffer.append(oFF.XStringUtils.addNumberPadded(this.m_hour, 2));
	buffer.append(":");
	buffer.append(oFF.XStringUtils.addNumberPadded(this.m_minute, 2));
	buffer.append(":");
	buffer.append(oFF.XStringUtils.addNumberPadded(this.m_second, 2));
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_millisecondsFractionStringRepresentation) && oFF.XInteger.convertFromString(this.m_millisecondsFractionStringRepresentation) > 0)
	{
		let endPosition = fractionSize;
		if (fractionSize > oFF.XTime.FRACTIONS_MAX_SIZE)
		{
			endPosition = oFF.XTime.FRACTIONS_MAX_SIZE;
		}
		let subFractions = oFF.XString.substring(this.m_millisecondsFractionStringRepresentation, 0, endPosition);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(subFractions) && oFF.XInteger.convertFromString(subFractions) > 0)
		{
			buffer.append(".");
			buffer.append(subFractions);
		}
	}
	return buffer.toString();
};
oFF.XTime.prototype.toSAPFormat = function()
{
	let buffer = oFF.XStringBuffer.create();
	buffer.append(oFF.XStringUtils.addNumberPadded(this.m_hour, 2));
	buffer.append(oFF.XStringUtils.addNumberPadded(this.m_minute, 2));
	buffer.append(oFF.XStringUtils.addNumberPadded(this.m_second, 2));
	return buffer.toString();
};
oFF.XTime.prototype.toString = function()
{
	return this.toIsoFormat();
};
oFF.XTime.prototype.updateFractionsOnMillisChange = function()
{
	let fullMillis = oFF.XStringUtils.addNumberPadded(this.m_millisecond, oFF.XTime.MILLISECOND_MAX_SIZE);
	this.setSecondFractions(oFF.XInteger.convertToString(oFF.XTime.extractFractions(fullMillis, 0, oFF.XTime.FRACTIONS_MAX_SIZE)));
};

oFF.XTimeSpan = function() {};
oFF.XTimeSpan.prototype = new oFF.XAbstractValue();
oFF.XTimeSpan.prototype._ff_c = "XTimeSpan";

oFF.XTimeSpan.create = function(timespan)
{
	let object = new oFF.XTimeSpan();
	object.setTimeSpan(timespan);
	return object;
};
oFF.XTimeSpan.prototype.m_timeSpan = 0;
oFF.XTimeSpan.prototype.cloneExt = function(flags)
{
	return oFF.XTimeSpan.create(this.m_timeSpan);
};
oFF.XTimeSpan.prototype.getTimeSpan = function()
{
	return this.m_timeSpan;
};
oFF.XTimeSpan.prototype.getValueType = function()
{
	return oFF.XValueType.TIMESPAN;
};
oFF.XTimeSpan.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	return this.m_timeSpan === other.m_timeSpan;
};
oFF.XTimeSpan.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let otherValue = value;
	this.m_timeSpan = otherValue.m_timeSpan;
};
oFF.XTimeSpan.prototype.setTimeSpan = function(value)
{
	this.m_timeSpan = value;
};
oFF.XTimeSpan.prototype.toString = function()
{
	return oFF.XLong.convertToString(this.m_timeSpan);
};

oFF.DateFormatterConstants = function() {};
oFF.DateFormatterConstants.prototype = new oFF.XConstant();
oFF.DateFormatterConstants.prototype._ff_c = "DateFormatterConstants";

oFF.DateFormatterConstants.ALLOWED_SEPARATORS = null;
oFF.DateFormatterConstants.AMPM_TOKEN = "a";
oFF.DateFormatterConstants.AMPM_TOKEN_CAP = "A";
oFF.DateFormatterConstants.DAY_OF_MONTH_TOKEN = "d";
oFF.DateFormatterConstants.HOUR_AM_PM_TOKEN = "h";
oFF.DateFormatterConstants.HOUR_TOKEN = "H";
oFF.DateFormatterConstants.MILLISECOND_TOKEN = "S";
oFF.DateFormatterConstants.MINUTE_TOKEN = "m";
oFF.DateFormatterConstants.MONTH_TOKEN = "M";
oFF.DateFormatterConstants.SECOND_TOKEN = "s";
oFF.DateFormatterConstants.TIMEZONE_TOKEN = "Z";
oFF.DateFormatterConstants.YEAR_TOKEN = "y";
oFF.DateFormatterConstants.isTokenValid = function(token)
{
	if (oFF.XString.isEqual(token, oFF.DateFormatterConstants.YEAR_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.MONTH_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.DAY_OF_MONTH_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.HOUR_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.HOUR_AM_PM_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.MINUTE_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.SECOND_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.MILLISECOND_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.TIMEZONE_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.AMPM_TOKEN) || oFF.XString.isEqual(token, oFF.DateFormatterConstants.AMPM_TOKEN_CAP))
	{
		return true;
	}
	return false;
};
oFF.DateFormatterConstants.setAllowedSeparators = function()
{
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS = oFF.XList.create();
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS.add("/");
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS.add(".");
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS.add(" ");
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS.add(":");
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS.add(",");
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS.add("T");
	oFF.DateFormatterConstants.ALLOWED_SEPARATORS.add("-");
};
oFF.DateFormatterConstants.staticSetup = function()
{
	oFF.DateFormatterConstants.setAllowedSeparators();
};

oFF.VarResolveMode = function() {};
oFF.VarResolveMode.prototype = new oFF.XConstant();
oFF.VarResolveMode.prototype._ff_c = "VarResolveMode";

oFF.VarResolveMode.DEFAULT_VALUE = null;
oFF.VarResolveMode.DOLLAR = null;
oFF.VarResolveMode.NONE = null;
oFF.VarResolveMode.PERCENT = null;
oFF.VarResolveMode.create = function(name, prefix, postfix)
{
	let newConstant = new oFF.VarResolveMode();
	newConstant._setupInternal(name);
	newConstant.m_prefix = prefix;
	newConstant.m_postfix = postfix;
	if (oFF.notNull(prefix))
	{
		newConstant.m_prefixSize = oFF.XString.size(prefix);
	}
	if (oFF.notNull(postfix))
	{
		newConstant.m_postfixSize = oFF.XString.size(postfix);
	}
	return newConstant;
};
oFF.VarResolveMode.staticSetup = function()
{
	oFF.VarResolveMode.NONE = oFF.VarResolveMode.create("None", null, null);
	oFF.VarResolveMode.DOLLAR = oFF.VarResolveMode.create("Dollar", oFF.XEnvironment.VAR_START, oFF.XEnvironment.VAR_END);
	oFF.VarResolveMode.PERCENT = oFF.VarResolveMode.create("Percent", "%", "%");
	oFF.VarResolveMode.DEFAULT_VALUE = oFF.VarResolveMode.DOLLAR;
};
oFF.VarResolveMode.prototype.m_postfix = null;
oFF.VarResolveMode.prototype.m_postfixSize = 0;
oFF.VarResolveMode.prototype.m_prefix = null;
oFF.VarResolveMode.prototype.m_prefixSize = 0;
oFF.VarResolveMode.prototype.getPostfix = function()
{
	return this.m_postfix;
};
oFF.VarResolveMode.prototype.getPostfixSize = function()
{
	return this.m_postfixSize;
};
oFF.VarResolveMode.prototype.getPrefix = function()
{
	return this.m_prefix;
};
oFF.VarResolveMode.prototype.getPrefixSize = function()
{
	return this.m_prefixSize;
};

oFF.DfXLambdaCollection = function() {};
oFF.DfXLambdaCollection.prototype = new oFF.XObject();
oFF.DfXLambdaCollection.prototype._ff_c = "DfXLambdaCollection";

oFF.DfXLambdaCollection.prototype.m_lambdaMap = null;
oFF.DfXLambdaCollection.prototype._generateFunctionUuid = function(lambda)
{
	return oFF.XStringUtils.concatenate3(this.getLambdaTypeName(), "_", oFF.XGuid.getGuid());
};
oFF.DfXLambdaCollection.prototype.addLambda = function(lambda)
{
	if (oFF.notNull(lambda))
	{
		let functionUuid = this._generateFunctionUuid(lambda);
		this.m_lambdaMap.put(functionUuid, lambda);
		return functionUuid;
	}
	return null;
};
oFF.DfXLambdaCollection.prototype.clear = function()
{
	this.m_lambdaMap.clear();
};
oFF.DfXLambdaCollection.prototype.contains = function(element)
{
	return this.m_lambdaMap.contains(element);
};
oFF.DfXLambdaCollection.prototype.getIterator = function()
{
	return this.getValuesAsReadOnlyList().getIterator();
};
oFF.DfXLambdaCollection.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_lambdaMap.getValuesAsReadOnlyList();
};
oFF.DfXLambdaCollection.prototype.hasElements = function()
{
	return this.m_lambdaMap.hasElements();
};
oFF.DfXLambdaCollection.prototype.isEmpty = function()
{
	return this.m_lambdaMap.isEmpty();
};
oFF.DfXLambdaCollection.prototype.prependLambda = function(lambda)
{
	if (oFF.notNull(lambda))
	{
		let oldMap = this.m_lambdaMap;
		this.m_lambdaMap = oFF.XLinkedHashMapByString.create();
		let functionUuid = this.addLambda(lambda);
		oFF.XCollectionUtils.mapEntries(oldMap, (key, value) => {
			this.m_lambdaMap.put(key, value);
		});
		oldMap.clear();
		oFF.XObjectExt.release(oldMap);
		return functionUuid;
	}
	return null;
};
oFF.DfXLambdaCollection.prototype.releaseObject = function()
{
	this.m_lambdaMap.clear();
	this.m_lambdaMap = oFF.XObjectExt.release(this.m_lambdaMap);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.DfXLambdaCollection.prototype.removeLambdaByUuid = function(uuid)
{
	this.m_lambdaMap.remove(uuid);
};
oFF.DfXLambdaCollection.prototype.setupExt = function()
{
	this.m_lambdaMap = oFF.XLinkedHashMapByString.create();
};
oFF.DfXLambdaCollection.prototype.size = function()
{
	return this.m_lambdaMap.size();
};

oFF.LifeCycleState = function() {};
oFF.LifeCycleState.prototype = new oFF.XConstant();
oFF.LifeCycleState.prototype._ff_c = "LifeCycleState";

oFF.LifeCycleState.ACTIVE = null;
oFF.LifeCycleState.INITIAL = null;
oFF.LifeCycleState.RELEASED = null;
oFF.LifeCycleState.SHUTTING_DOWN = null;
oFF.LifeCycleState.STARTING_UP = null;
oFF.LifeCycleState.TERMINATED = null;
oFF.LifeCycleState.create = function(name, code)
{
	let state = oFF.XConstant.setupName(new oFF.LifeCycleState(), name);
	state.m_code = code;
	return state;
};
oFF.LifeCycleState.staticSetup = function()
{
	oFF.LifeCycleState.INITIAL = oFF.LifeCycleState.create("Initial", 0);
	oFF.LifeCycleState.STARTING_UP = oFF.LifeCycleState.create("StartingUp", 1);
	oFF.LifeCycleState.ACTIVE = oFF.LifeCycleState.create("Active", 2);
	oFF.LifeCycleState.SHUTTING_DOWN = oFF.LifeCycleState.create("ShuttingDown", 3);
	oFF.LifeCycleState.TERMINATED = oFF.LifeCycleState.create("Terminated", 4);
	oFF.LifeCycleState.RELEASED = oFF.LifeCycleState.create("Released", 5);
};
oFF.LifeCycleState.prototype.m_code = 0;
oFF.LifeCycleState.prototype.getCode = function()
{
	return this.m_code;
};

oFF.XLogWriter = function() {};
oFF.XLogWriter.prototype = new oFF.DfLogWriter();
oFF.XLogWriter.prototype._ff_c = "XLogWriter";

oFF.XLogWriter.create = function(output, errorStream)
{
	let logWriter = new oFF.XLogWriter();
	logWriter.setupExt(output, errorStream);
	return logWriter;
};
oFF.XLogWriter.prototype.m_errorOutput = null;
oFF.XLogWriter.prototype.m_layers = null;
oFF.XLogWriter.prototype.m_output = null;
oFF.XLogWriter.prototype.m_severity = 0;
oFF.XLogWriter.prototype.addLogLayer = function(layer)
{
	if (oFF.XString.isEqual(layer, oFF.OriginLayer.ALL))
	{
		this.clear();
	}
	else
	{
		if (this.m_layers.contains(oFF.OriginLayer.ALL))
		{
			this.m_layers.removeElement(oFF.OriginLayer.ALL);
		}
	}
	this.m_layers.add(layer);
};
oFF.XLogWriter.prototype.clear = function()
{
	this.m_layers.clear();
};
oFF.XLogWriter.prototype.disableAllLogLayers = function()
{
	this.m_layers.clear();
};
oFF.XLogWriter.prototype.enableAllLogLayers = function()
{
	this.addLogLayer(oFF.OriginLayer.ALL);
};
oFF.XLogWriter.prototype.hasElements = function()
{
	return this.m_layers.hasElements();
};
oFF.XLogWriter.prototype.isEmpty = function()
{
	return this.m_layers.isEmpty();
};
oFF.XLogWriter.prototype.isLogWritten = function(layer, severity)
{
	let isEnabled = false;
	if (oFF.notNull(this.m_output))
	{
		let theSeverity = severity;
		if (oFF.isNull(theSeverity))
		{
			theSeverity = oFF.Severity.DEBUG;
		}
		let theLayer = layer;
		if (oFF.isNull(theLayer))
		{
			theLayer = oFF.OriginLayer.MISC;
		}
		isEnabled = theSeverity.getLevel() >= this.m_severity;
		if (isEnabled === true)
		{
			isEnabled = this.m_layers.contains(oFF.OriginLayer.ALL) || this.m_layers.contains(theLayer);
		}
	}
	return isEnabled;
};
oFF.XLogWriter.prototype.logExt = function(layer, severity, code, message)
{
	let theSeverity = severity;
	if (oFF.isNull(theSeverity))
	{
		theSeverity = oFF.Severity.DEBUG;
	}
	let text = oFF.DfLogWriter.createLogString(layer, theSeverity, code, message);
	if (theSeverity === oFF.Severity.ERROR && oFF.notNull(this.m_errorOutput))
	{
		this.m_errorOutput.printError(text);
	}
	else if (oFF.notNull(this.m_output) && this.isLogWritten(layer, theSeverity))
	{
		this.m_output.println(text);
	}
};
oFF.XLogWriter.prototype.releaseObject = function()
{
	this.m_output = null;
	this.m_errorOutput = null;
	this.m_layers = oFF.XObjectExt.release(this.m_layers);
	oFF.DfLogWriter.prototype.releaseObject.call( this );
};
oFF.XLogWriter.prototype.setErrorStream = function(errorStream)
{
	this.m_errorOutput = errorStream;
};
oFF.XLogWriter.prototype.setLogFilterLevel = function(filterLevel)
{
	this.m_severity = filterLevel;
};
oFF.XLogWriter.prototype.setLogStream = function(output)
{
	this.m_output = output;
};
oFF.XLogWriter.prototype.setupExt = function(output, errorStream)
{
	this.m_output = output;
	this.m_errorOutput = errorStream;
	this.m_layers = oFF.XHashSetOfString.create();
	this.m_severity = oFF.Severity.DEBUG.getLevel();
	this.enableAllLogLayers();
};
oFF.XLogWriter.prototype.size = function()
{
	return this.m_layers.size();
};

oFF.XMessage = function() {};
oFF.XMessage.prototype = new oFF.XAbstractValue();
oFF.XMessage.prototype._ff_c = "XMessage";

oFF.XMessage.createError = function(originLayer, message, errorCause, withStackTrace, extendedInfo)
{
	return oFF.XMessage.createMessage(originLayer, oFF.Severity.ERROR, oFF.ErrorCodes.OTHER_ERROR, message, errorCause, withStackTrace, extendedInfo);
};
oFF.XMessage.createErrorWithCode = function(originLayer, errorCode, message, errorCause, withStackTrace, extendedInfo)
{
	return oFF.XMessage.createMessage(originLayer, oFF.Severity.ERROR, errorCode, message, errorCause, withStackTrace, extendedInfo);
};
oFF.XMessage.createMessage = function(originLayer, severity, code, message, errorCause, withStackTrace, extendedInfo)
{
	let msg = new oFF.XMessage();
	msg.setupMsg(originLayer, severity, code, message, errorCause, withStackTrace, extendedInfo);
	return msg;
};
oFF.XMessage.prototype.m_code = 0;
oFF.XMessage.prototype.m_errorCause = null;
oFF.XMessage.prototype.m_extendedInfo = null;
oFF.XMessage.prototype.m_extendedInfoType = null;
oFF.XMessage.prototype.m_messageClass = null;
oFF.XMessage.prototype.m_olapMessageClass = 0;
oFF.XMessage.prototype.m_originLayer = null;
oFF.XMessage.prototype.m_severity = null;
oFF.XMessage.prototype.m_stackTrace = null;
oFF.XMessage.prototype.m_text = null;
oFF.XMessage.prototype.cloneExt = function(flags)
{
	let message = oFF.XMessage.createMessage(this.m_originLayer, this.m_severity, this.m_code, this.getText(), this.m_errorCause, oFF.notNull(this.m_stackTrace), this.m_extendedInfo);
	message.setExtendendInfoType(this.m_extendedInfoType);
	return message;
};
oFF.XMessage.prototype.getCode = function()
{
	return this.m_code;
};
oFF.XMessage.prototype.getErrorCause = function()
{
	return this.m_errorCause;
};
oFF.XMessage.prototype.getExtendedInfo = function()
{
	return this.m_extendedInfo;
};
oFF.XMessage.prototype.getExtendedInfoType = function()
{
	return this.m_extendedInfoType;
};
oFF.XMessage.prototype.getMessageClass = function()
{
	return this.m_messageClass;
};
oFF.XMessage.prototype.getOlapMessageClass = function()
{
	return this.m_olapMessageClass;
};
oFF.XMessage.prototype.getOriginLayer = function()
{
	return this.m_originLayer;
};
oFF.XMessage.prototype.getSeverity = function()
{
	return this.m_severity;
};
oFF.XMessage.prototype.getStackTrace = function()
{
	return this.m_stackTrace;
};
oFF.XMessage.prototype.getText = function()
{
	return this.m_text;
};
oFF.XMessage.prototype.getValueType = function()
{
	return oFF.XValueType.ERROR_VALUE;
};
oFF.XMessage.prototype.hasCode = function()
{
	return this.m_code !== oFF.ErrorCodes.OTHER_ERROR;
};
oFF.XMessage.prototype.hasErrorCause = function()
{
	return oFF.notNull(this.m_errorCause);
};
oFF.XMessage.prototype.hasExtendedInfo = function()
{
	return oFF.notNull(this.m_extendedInfo);
};
oFF.XMessage.prototype.hasStackTrace = function()
{
	return oFF.notNull(this.m_stackTrace);
};
oFF.XMessage.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherMessage = other;
	if (!this.getSeverity().isEqualTo(otherMessage.getSeverity()))
	{
		return false;
	}
	if (this.getCode() !== otherMessage.getCode())
	{
		return false;
	}
	return true;
};
oFF.XMessage.prototype.releaseObject = function()
{
	this.m_errorCause = oFF.XObjectExt.release(this.m_errorCause);
	this.m_stackTrace = oFF.XObjectExt.release(this.m_stackTrace);
	this.m_extendedInfo = null;
	this.m_extendedInfoType = null;
	this.m_messageClass = null;
	this.m_originLayer = null;
	this.m_severity = null;
	this.m_text = null;
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.XMessage.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let valueMessage = value;
	this.m_code = valueMessage.getCode();
	this.m_errorCause = valueMessage.getErrorCause();
	this.m_extendedInfo = valueMessage.getExtendedInfo();
	this.m_extendedInfoType = valueMessage.getExtendedInfoType();
	this.m_messageClass = valueMessage.getMessageClass();
	this.m_severity = valueMessage.getSeverity();
	let stackTrace = valueMessage.getStackTrace();
	this.m_stackTrace = oFF.XObjectExt.cloneIfNotNull(stackTrace);
};
oFF.XMessage.prototype.setCode = function(newCode)
{
	this.m_code = newCode;
};
oFF.XMessage.prototype.setExtendendInfo = function(extendedInfo)
{
	this.m_extendedInfo = extendedInfo;
};
oFF.XMessage.prototype.setExtendendInfoType = function(extendedInfoType)
{
	this.m_extendedInfoType = extendedInfoType;
};
oFF.XMessage.prototype.setMessageClass = function(msgClass)
{
	this.m_messageClass = msgClass;
};
oFF.XMessage.prototype.setOlapMessageClass = function(olapMessageClass)
{
	this.m_olapMessageClass = olapMessageClass;
};
oFF.XMessage.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.XMessage.prototype.setupMsg = function(originLayer, severity, errorCode, message, errorCause, withStackTrace, nativeCause)
{
	this.setText(message);
	this.m_originLayer = originLayer;
	this.m_severity = severity;
	this.m_code = errorCode;
	this.m_extendedInfoType = oFF.ExtendedInfoType.UNKNOWN;
	this.m_errorCause = errorCause;
	if (withStackTrace && oFF.XStackTrace.supportsStackTrace())
	{
		this.m_stackTrace = oFF.XStackTrace.create(3);
	}
	this.m_extendedInfo = nativeCause;
	this.m_olapMessageClass = -1;
};
oFF.XMessage.prototype.toString = function()
{
	let buffer = oFF.XStringBuffer.create();
	buffer.append(this.m_severity.getName());
	buffer.append(" [").append(this.m_originLayer).append("]:");
	if (this.m_code !== oFF.ErrorCodes.OTHER_ERROR)
	{
		buffer.append(" (#").appendInt(this.m_code).append(")");
	}
	if (this.getText() !== null)
	{
		buffer.append(" ").append(this.getText());
	}
	if (oFF.notNull(this.m_messageClass))
	{
		buffer.append("; MsgClass: ").append(this.m_messageClass).append(";");
	}
	if (this.m_olapMessageClass !== -1)
	{
		buffer.append("; OlapMsgClass: ").appendInt(this.m_olapMessageClass).append(";");
	}
	if (this.getExtendedInfo() !== null)
	{
		let extendedInfoType = this.getExtendedInfoType();
		if (extendedInfoType !== oFF.ExtendedInfoType.QUERY_MODEL_ID)
		{
			if (oFF.notNull(extendedInfoType) && extendedInfoType !== oFF.ExtendedInfoType.UNKNOWN)
			{
				buffer.append(" ").append(extendedInfoType.getName());
			}
			buffer.append(" [").append(this.getExtendedInfo().toString()).append("]");
		}
	}
	return buffer.toString();
};

oFF.XValueAccess = function() {};
oFF.XValueAccess.prototype = new oFF.XObject();
oFF.XValueAccess.prototype._ff_c = "XValueAccess";

oFF.XValueAccess.copy = function(source, dest)
{
	let valueType = source.getValueType();
	let hasValue = source.hasValue();
	if (hasValue)
	{
		if (valueType === oFF.XValueType.INTEGER)
		{
			dest.setInteger(source.getInteger());
		}
		else if (valueType === oFF.XValueType.LONG)
		{
			dest.setLong(source.getLong());
		}
		else if (valueType === oFF.XValueType.DOUBLE)
		{
			dest.setDouble(source.getDouble());
		}
		else if (valueType === oFF.XValueType.DECIMAL_FLOAT)
		{
			dest.setDecFloat(source.getDecFloat());
		}
		else if (valueType === oFF.XValueType.STRING)
		{
			dest.setString(source.getString());
		}
		else if (valueType === oFF.XValueType.BOOLEAN)
		{
			dest.setBoolean(source.getBoolean());
		}
		else if (valueType === oFF.XValueType.DATE)
		{
			dest.setDate(source.getDate().clone());
		}
		else if (valueType === oFF.XValueType.TIME)
		{
			dest.setTime(source.getTime().clone());
		}
		else if (valueType === oFF.XValueType.DATE_TIME)
		{
			dest.setDateTime(source.getDateTime().clone());
		}
		else if (valueType === oFF.XValueType.TIMESPAN)
		{
			dest.setTimeSpan(source.getTimeSpan());
		}
		else if (valueType === oFF.XValueType.LINE_STRING)
		{
			dest.setLineString(source.getLineString().clone());
		}
		else if (valueType === oFF.XValueType.MULTI_LINE_STRING)
		{
			dest.setMultiLineString(source.getMultiLineString().clone());
		}
		else if (valueType === oFF.XValueType.POINT)
		{
			dest.setPoint(source.getPoint().clone());
		}
		else if (valueType === oFF.XValueType.MULTI_POINT)
		{
			dest.setMultiPoint(source.getMultiPoint().clone());
		}
		else if (valueType === oFF.XValueType.POLYGON)
		{
			dest.setPolygon(source.getPolygon().clone());
		}
		else if (valueType === oFF.XValueType.MULTI_POLYGON)
		{
			dest.setMultiPolygon(source.getMultiPolygon().clone());
		}
	}
	else
	{
		dest.setNullByType(valueType);
	}
};
oFF.XValueAccess.create = function()
{
	return new oFF.XValueAccess();
};
oFF.XValueAccess.createWithType = function(valueType)
{
	let newObj = new oFF.XValueAccess();
	newObj.m_type = valueType;
	return newObj;
};
oFF.XValueAccess.createWithValue = function(value)
{
	let newObj = new oFF.XValueAccess();
	newObj.m_value = value;
	newObj.m_type = value.getValueType();
	return newObj;
};
oFF.XValueAccess.prototype.m_type = null;
oFF.XValueAccess.prototype.m_value = null;
oFF.XValueAccess.prototype.checkValueType = function(expected)
{
	if (oFF.isNull(this.m_type))
	{
		this.m_type = expected;
	}
	else if (!this.m_type.isTypeOf(expected))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("ValueAccess is not of type ", expected.getName()));
	}
};
oFF.XValueAccess.prototype.copyFrom = function(other, flags)
{
	oFF.XValueAccess.copy(other, this);
};
oFF.XValueAccess.prototype.getBoolean = function()
{
	return oFF.XValueUtil.getBoolean(this.m_value, false, true);
};
oFF.XValueAccess.prototype.getDate = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getDateTime = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getDecFloat = function()
{
	return oFF.XValueUtil.getDecFloat(this.m_value, false, true);
};
oFF.XValueAccess.prototype.getDouble = function()
{
	return oFF.XValueUtil.getDouble(this.m_value, false, true);
};
oFF.XValueAccess.prototype.getFormattedValue = function()
{
	return this.getString();
};
oFF.XValueAccess.prototype.getGeometry = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getInteger = function()
{
	return oFF.XValueUtil.getInteger(this.m_value, false, true);
};
oFF.XValueAccess.prototype.getLineString = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getLong = function()
{
	return oFF.XValueUtil.getLong(this.m_value, false, true);
};
oFF.XValueAccess.prototype.getMultiLineString = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getMultiPoint = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getMultiPolygon = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getNull = function()
{
	return null;
};
oFF.XValueAccess.prototype.getPoint = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getPolygon = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getString = function()
{
	return oFF.XValueUtil.getString(this.m_value);
};
oFF.XValueAccess.prototype.getTime = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getTimeSpan = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getValue = function()
{
	return this.m_value;
};
oFF.XValueAccess.prototype.getValueType = function()
{
	return this.m_type;
};
oFF.XValueAccess.prototype.hasValue = function()
{
	return oFF.notNull(this.m_value);
};
oFF.XValueAccess.prototype.isEqualTo = function(other)
{
	if (oFF.isNull(other))
	{
		return false;
	}
	if (this === other)
	{
		return true;
	}
	let xOther = other;
	if (this.hasValue() !== xOther.hasValue())
	{
		return false;
	}
	if (this.getValue() === null && xOther.getValue() === null)
	{
		return this.getValueType() === xOther.getValueType();
	}
	return this.getValue().isEqualTo(xOther.getValue());
};
oFF.XValueAccess.prototype.parseString = function(value)
{
	let messages = oFF.MessageManagerSimple.createMessageManager();
	let valueType = this.getValueType();
	if (valueType === oFF.XValueType.STRING)
	{
		this.setString(value);
	}
	else if (valueType === oFF.XValueType.DOUBLE)
	{
		try
		{
			this.setDouble(oFF.XDouble.convertFromString(value));
		}
		catch (a)
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_DOUBLE_VALUE, "Cannot parse double value");
		}
	}
	else if (valueType === oFF.XValueType.DECIMAL_FLOAT)
	{
		try
		{
			this.setDecFloat(oFF.XDecFloatByString.create(value));
		}
		catch (a1)
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_DOUBLE_VALUE, "Cannot parse double value");
		}
	}
	else if (valueType === oFF.XValueType.INTEGER)
	{
		try
		{
			this.setInteger(oFF.XInteger.convertFromStringWithRadix(value, 10));
		}
		catch (b)
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_INT_VALUE, "Cannot parse integer value");
		}
	}
	else if (valueType === oFF.XValueType.LONG)
	{
		try
		{
			this.setLong(oFF.XLong.convertFromString(value));
		}
		catch (c)
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_LONG_VALUE, "Cannot parse long value");
		}
	}
	else if (valueType === oFF.XValueType.BOOLEAN)
	{
		try
		{
			this.setBoolean(oFF.XBoolean.convertFromString(value));
		}
		catch (d)
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_BOOLEAN_VALUE, "Cannot parse boolean value");
		}
	}
	else if (valueType === oFF.XValueType.DATE)
	{
		let dateValue = oFF.XDate.createDateSafe(value);
		if (oFF.isNull(dateValue))
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_DATE_VALUE, "Cannot parse date value");
		}
		else
		{
			this.setDate(dateValue);
		}
	}
	else if (valueType === oFF.XValueType.TIME)
	{
		let timeValue = oFF.XTime.createTimeSafe(value);
		if (oFF.isNull(timeValue))
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_TIME_VALUE, "Cannot parse time value");
		}
		else
		{
			this.setTime(timeValue);
		}
	}
	else if (valueType === oFF.XValueType.DATE_TIME)
	{
		let dateTimeValue = oFF.XDateTime.createDateTimeSafe(value);
		if (oFF.isNull(dateTimeValue))
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_DATE_TIME_VALUE, "Cannot parse date time value");
		}
		else
		{
			this.setDateTime(dateTimeValue);
		}
	}
	else if (valueType === oFF.XValueType.TIMESPAN)
	{
		try
		{
			let timespan = oFF.XLong.convertFromString(value);
			let timeSpanValue = oFF.XTimeSpan.create(timespan);
			this.setTimeSpan(timeSpanValue);
		}
		catch (h)
		{
			messages.addError(oFF.ErrorCodes.PARSING_ERROR_TIMESPAN, "Cannot parse timespan value");
		}
	}
	else if (valueType.isSpatial())
	{
		let geometryType = null;
		try
		{
			let geometryValue = oFF.XGeometryValue.createGeometryValueWithWkt(value);
			oFF.XObjectExt.assertNotNullExt(geometryValue, "Cannot parse spatial value");
			geometryType = geometryValue.getValueType();
			if (geometryType === oFF.XValueType.POINT)
			{
				this.setPoint(geometryValue);
			}
			else if (geometryType === oFF.XValueType.MULTI_POINT)
			{
				this.setMultiPoint(geometryValue);
			}
			else if (geometryType === oFF.XValueType.LINE_STRING)
			{
				this.setLineString(geometryValue);
			}
			else if (geometryType === oFF.XValueType.MULTI_LINE_STRING)
			{
				this.setMultiLineString(geometryValue);
			}
			else if (geometryType === oFF.XValueType.POLYGON)
			{
				this.setPolygon(geometryValue);
			}
			else
			{
				this.setMultiPolygon(geometryValue);
			}
		}
		catch (i)
		{
			let message = oFF.XStringBuffer.create();
			if (oFF.isNull(geometryType))
			{
				message.append("Coudn't parse value");
			}
			else
			{
				message.append("Expected valuetype '").append(this.m_type.getName()).append("' but got '").append(geometryType.getName()).append("' instead.");
			}
			messages.addError(oFF.ErrorCodes.INVALID_DATATYPE, message.toString());
			oFF.XObjectExt.release(message);
		}
	}
	return messages;
};
oFF.XValueAccess.prototype.releaseObject = function()
{
	this.m_type = null;
	this.m_value = oFF.XObjectExt.release(this.m_value);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XValueAccess.prototype.setBoolean = function(value)
{
	this.checkValueType(oFF.XValueType.BOOLEAN);
	this.m_value = oFF.XBooleanValue.create(value);
};
oFF.XValueAccess.prototype.setDate = function(value)
{
	this.checkValueType(oFF.XValueType.DATE);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setDateTime = function(value)
{
	this.checkValueType(oFF.XValueType.DATE_TIME);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setDecFloat = function(value)
{
	this.checkValueType(oFF.XValueType.DECIMAL_FLOAT);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setDouble = function(value)
{
	this.checkValueType(oFF.XValueType.DOUBLE);
	this.m_value = oFF.XDoubleValue.create(value);
};
oFF.XValueAccess.prototype.setInteger = function(value)
{
	this.checkValueType(oFF.XValueType.INTEGER);
	this.m_value = oFF.XIntegerValue.create(value);
};
oFF.XValueAccess.prototype.setLineString = function(value)
{
	this.checkValueType(oFF.XValueType.LINE_STRING);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setLong = function(value)
{
	this.checkValueType(oFF.XValueType.LONG);
	this.m_value = oFF.XLongValue.create(value);
};
oFF.XValueAccess.prototype.setMultiLineString = function(value)
{
	this.checkValueType(oFF.XValueType.MULTI_LINE_STRING);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setMultiPoint = function(value)
{
	this.checkValueType(oFF.XValueType.MULTI_POINT);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setMultiPolygon = function(value)
{
	this.checkValueType(oFF.XValueType.MULTI_POLYGON);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setNullByType = function(nullValueType)
{
	this.m_value = null;
	this.m_type = nullValueType;
};
oFF.XValueAccess.prototype.setPoint = function(value)
{
	this.checkValueType(oFF.XValueType.POINT);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setPolygon = function(value)
{
	this.checkValueType(oFF.XValueType.POLYGON);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setString = function(value)
{
	this.checkValueType(oFF.XValueType.STRING);
	this.m_value = oFF.XStringValue.create(value);
};
oFF.XValueAccess.prototype.setTime = function(value)
{
	this.checkValueType(oFF.XValueType.TIME);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setTimeSpan = function(value)
{
	this.checkValueType(oFF.XValueType.TIMESPAN);
	this.m_value = value;
};
oFF.XValueAccess.prototype.setXValue = function(value)
{
	oFF.XValueAccess.copy(oFF.XValueAccess.createWithValue(value), this);
};
oFF.XValueAccess.prototype.toString = function()
{
	return this.getString();
};

oFF.XLanguageValue = function() {};
oFF.XLanguageValue.prototype = new oFF.XAbstractValue();
oFF.XLanguageValue.prototype._ff_c = "XLanguageValue";

oFF.XLanguageValue.create = function(value)
{
	let object = new oFF.XLanguageValue();
	object.setLanguage(value);
	return object;
};
oFF.XLanguageValue.prototype.m_languageValue = null;
oFF.XLanguageValue.prototype.cloneExt = function(flags)
{
	return oFF.XLanguageValue.create(this.m_languageValue);
};
oFF.XLanguageValue.prototype.getLanguage = function()
{
	return this.m_languageValue;
};
oFF.XLanguageValue.prototype.getValueType = function()
{
	return oFF.XValueType.LANGUAGE;
};
oFF.XLanguageValue.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return oFF.XString.isEqual(this.m_languageValue, otherValue.m_languageValue);
};
oFF.XLanguageValue.prototype.releaseObject = function()
{
	this.m_languageValue = null;
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.XLanguageValue.prototype.resetValue = function(value)
{
	oFF.XAbstractValue.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	this.m_languageValue = value.m_languageValue;
};
oFF.XLanguageValue.prototype.setLanguage = function(languageValue)
{
	this.m_languageValue = languageValue;
};
oFF.XLanguageValue.prototype.toString = function()
{
	return this.m_languageValue;
};

oFF.AbstractGeometry = function() {};
oFF.AbstractGeometry.prototype = new oFF.XAbstractValue();
oFF.AbstractGeometry.prototype._ff_c = "AbstractGeometry";

oFF.AbstractGeometry.WKT_EMTPY = "EMPTY";
oFF.AbstractGeometry.prototype.m_srid = null;
oFF.AbstractGeometry.prototype.getSrid = function()
{
	return this.m_srid;
};
oFF.AbstractGeometry.prototype.getStringRepresentation = function()
{
	return this.toWKT();
};
oFF.AbstractGeometry.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractValue.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let xOther = other;
	return oFF.XObjectExt.areEqual(this.getSrid(), xOther.getSrid());
};
oFF.AbstractGeometry.prototype.releaseObject = function()
{
	this.m_srid = oFF.XObjectExt.release(this.m_srid);
	oFF.XAbstractValue.prototype.releaseObject.call( this );
};
oFF.AbstractGeometry.prototype.setSrid = function(srid)
{
	this.m_srid = srid;
};

oFF.XDate = function() {};
oFF.XDate.prototype = new oFF.XAbstractCalendarDate();
oFF.XDate.prototype._ff_c = "XDate";

oFF.XDate.EPOCH_OFFSET = 719163;
oFF.XDate.FIELD_UNDEFINED = -2147483648;
oFF.XDate.create = function()
{
	return oFF.XDate.createCurrentLocalDate();
};
oFF.XDate.createCurrentLocalDate = function()
{
	let timeInMillis = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	let timezoneOffset = oFF.XSystemUtils.getSystemTimezoneOffsetInMilliseconds();
	let timeZone = oFF.XSimpleTimeZone.createWithOffsetAndId(timezoneOffset, "");
	return oFF.XDate.createWithMillisAndTimezone(timeInMillis, timeZone);
};
oFF.XDate.createDateFromIsoFormat = function(date)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(date))
	{
		if (oFF.XString.size(date) !== 10)
		{
			let posDateTimeDelim = oFF.XString.indexOf(date, "T");
			if (posDateTimeDelim > 0)
			{
				result = oFF.XDate.createDateFromIsoFormat(oFF.XString.substring(date, 0, posDateTimeDelim));
			}
			else
			{
				posDateTimeDelim = oFF.XString.indexOf(date, " ");
				if (posDateTimeDelim > 0)
				{
					result = oFF.XDate.createDateFromIsoFormat(oFF.XString.substring(date, 0, posDateTimeDelim));
				}
			}
		}
		else
		{
			try
			{
				let yearString = oFF.XString.substring(date, 0, 4);
				let year = oFF.XInteger.convertFromStringWithRadix(yearString, 10);
				let monthString = oFF.XString.substring(date, 5, 7);
				let month = oFF.XInteger.convertFromStringWithRadix(monthString, 10);
				let dayString = oFF.XString.substring(date, 8, 10);
				let day = oFF.XInteger.convertFromStringWithRadix(dayString, 10);
				result = oFF.XDate.createDateWithValues(year, month, day);
			}
			catch (e)
			{
				throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Not a valid ISO8601 date: ", date));
			}
		}
	}
	else if (oFF.notNull(date))
	{
		result = oFF.XEmptyDate.create();
	}
	return result;
};
oFF.XDate.createDateFromSAPFormat = function(date)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(date) && oFF.XString.size(date) === 8)
	{
		try
		{
			let yearString = oFF.XString.substring(date, 0, 4);
			let year = oFF.XInteger.convertFromStringWithRadix(yearString, 10);
			let monthString = oFF.XString.substring(date, 4, 6);
			let month = oFF.XInteger.convertFromStringWithRadix(monthString, 10);
			let dayString = oFF.XString.substring(date, 6, 8);
			let day = oFF.XInteger.convertFromStringWithRadix(dayString, 10);
			result = oFF.XDate.createDateWithValues(year, month, day);
		}
		catch (e)
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Not a valid date format, expected 'YYYYMMDD': ", date));
		}
	}
	else if (oFF.XString.isEqual("#", date))
	{
		result = oFF.XDate.createHollowDate();
	}
	return result;
};
oFF.XDate.createDateFromString = function(date, valueFormat)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(date))
	{
		if (valueFormat === oFF.DateTimeFormat.ISO)
		{
			result = oFF.XDate.createDateFromIsoFormat(date);
		}
		else if (valueFormat === oFF.DateTimeFormat.SAP)
		{
			result = oFF.XDate.createDateFromSAPFormat(date);
		}
		else
		{
			let strLen = oFF.XString.size(date);
			if (strLen === 8)
			{
				result = oFF.XDate.createDateFromSAPFormat(date);
			}
			else if (strLen === 10)
			{
				result = oFF.XDate.createDateFromIsoFormat(date);
			}
		}
	}
	return result;
};
oFF.XDate.createDateFromStringWithFlag = function(date, isSapFormat)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(date))
	{
		if (isSapFormat)
		{
			result = oFF.XDate.createDateFromSAPFormat(date);
		}
		else
		{
			result = oFF.XDate.createDateFromIsoFormat(date);
		}
	}
	return result;
};
oFF.XDate.createDateSafe = function(date)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(date))
	{
		let size = oFF.XString.size(date);
		if (size === 8)
		{
			try
			{
				result = oFF.XDate.createDateFromSAPFormat(date);
			}
			catch (ignored)
			{
				result = null;
			}
		}
		else if (oFF.XString.isEqual("#", date))
		{
			result = oFF.XDate.createHollowDate();
		}
		if (oFF.isNull(result))
		{
			if (oFF.XString.containsString(date, "-"))
			{
				try
				{
					result = oFF.XDate.createDateFromIsoFormat(date);
				}
				catch (ignored1)
				{
					result = null;
				}
			}
		}
	}
	return result;
};
oFF.XDate.createDateWithValues = function(year, month, day)
{
	let date = oFF.XDate.createWithTimeZone(oFF.XSimpleTimeZone.create());
	date.setYear(year);
	date.setMonthOfYear(month);
	date.setDayOfMonth(day);
	return date;
};
oFF.XDate.createHollowDate = function()
{
	return new oFF.XDate();
};
oFF.XDate.createWithMillis = function(timeInMillis)
{
	return oFF.XDate.createWithMillisAndTimezone(timeInMillis, oFF.XSimpleTimeZone.create());
};
oFF.XDate.createWithMillisAndTimezone = function(timeInMillis, timeZone)
{
	let calendar = oFF.XGregorianCalendar.createWithTimeZone(timeZone);
	calendar.setTimeInMillis(timeInMillis);
	let year = calendar.get(oFF.DateConstants.YEAR);
	let month = calendar.get(oFF.DateConstants.MONTH);
	let day = calendar.get(oFF.DateConstants.DAY_OF_MONTH);
	let date = oFF.XDate.createDateWithValues(year, month, day);
	date.setTimeZone(timeZone);
	return date;
};
oFF.XDate.createWithTimeZone = function(timeZone)
{
	let result = new oFF.XDate();
	result.m_dayOfWeek = oFF.XDate.FIELD_UNDEFINED;
	result.m_timeZone = timeZone;
	return result;
};
oFF.XDate.isDateIsoFormat = function(date)
{
	let dateFormat = "^([0-9]{4})-([0-9]{2})-([0-9]{2})$";
	let matcher = oFF.XRegex.getInstance().getFirstMatch(date, dateFormat);
	if (oFF.isNull(matcher) || matcher.getGroup(0) === null)
	{
		return false;
	}
	else
	{
		let yearString = matcher.getGroup(1);
		let monthString = matcher.getGroup(2);
		let dayString = matcher.getGroup(3);
		let year = oFF.XInteger.convertFromStringWithRadix(yearString, 10);
		let month = oFF.XInteger.convertFromStringWithRadix(monthString, 10);
		let day = oFF.XInteger.convertFromStringWithRadix(dayString, 10);
		if (year < 0 || year > 9999)
		{
			return false;
		}
		let gregorianCalendar = oFF.XGregorianCalendar.create();
		let isLeapYear = gregorianCalendar.isLeapYear(year);
		if (month < 1 || month > 12)
		{
			return false;
		}
		if (month === 2)
		{
			return isLeapYear ? day >= 1 && day <= 29 : day >= 1 && day <= 28;
		}
		else if (month === 4 || month === 6 || month === 9 || month === 11)
		{
			return day >= 1 && day <= 30;
		}
		else
		{
			return day >= 1 && day <= 31;
		}
	}
};
oFF.XDate.padWithZeros = function(buffer, start, end)
{
	for (let i = start; i < end; i++)
	{
		buffer.append("0");
	}
};
oFF.XDate.prototype.m_day = 0;
oFF.XDate.prototype.m_dayOfWeek = 0;
oFF.XDate.prototype.m_daylightSaving = 0;
oFF.XDate.prototype.m_era = null;
oFF.XDate.prototype.m_forceStandardTime = false;
oFF.XDate.prototype.m_leapYear = false;
oFF.XDate.prototype.m_month = 0;
oFF.XDate.prototype.m_timeZone = null;
oFF.XDate.prototype.m_year = 0;
oFF.XDate.prototype.addDaysOfMonth = function(daysToAdd)
{
	if (daysToAdd !== 0)
	{
		this.m_day = this.m_day + daysToAdd;
	}
};
oFF.XDate.prototype.addMonths = function(monthsToAdd)
{
	if (monthsToAdd !== 0)
	{
		this.m_month = this.m_month + monthsToAdd;
		this.setNormalized(false);
	}
};
oFF.XDate.prototype.addYears = function(yearsToAdd)
{
	if (yearsToAdd !== 0)
	{
		this.m_year = this.m_year + yearsToAdd;
		this.setNormalized(false);
	}
};
oFF.XDate.prototype.cloneExt = function(flags)
{
	return oFF.XDate.createDateWithValues(this.m_year, this.m_month, this.m_day);
};
oFF.XDate.prototype.dateFromFixedDate = function(fixedDate)
{
	let year;
	let jan1;
	let isLeap;
	let gcal = oFF.XGregorianCalendar.create();
	year = this.getGregorianYearFromFixedDate(fixedDate);
	jan1 = this.getFixedDateWithYearMonthDay(year, oFF.DateConstants.JANUARY, 1);
	isLeap = gcal.isLeapYear(year);
	let priorDays = oFF.XLong.convertToInt(fixedDate - jan1);
	let mar1 = jan1 + 31 + 28;
	if (isLeap)
	{
		mar1 = mar1 + 1;
	}
	if (fixedDate >= mar1)
	{
		if (isLeap)
		{
			priorDays = priorDays + 1;
		}
		else
		{
			priorDays = priorDays + 2;
		}
	}
	let month = 12 * priorDays + 373;
	if (month > 0)
	{
		month = oFF.XMath.div(month, 367);
	}
	else
	{
		month = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longFloorDivide(month, 367));
	}
	let month1 = jan1 + oFF.DateConstants.ACCUMULATED_DAYS_IN_MONTH.get(month);
	if (isLeap && month >= oFF.DateConstants.MARCH)
	{
		month1 = month1 + 1;
	}
	let dayOfMonth = oFF.XLong.convertToInt(fixedDate - month1 + 1);
	let dayOfWeek = this.getDayOfWeekFromFixedDate(fixedDate);
	this.setYear(year);
	this.setMonthOfYear(month);
	this.setDayOfMonth(dayOfMonth);
	this.setDayOfWeek(dayOfWeek);
	this.setLeapYear(isLeap);
};
oFF.XDate.prototype.difference = function(other)
{
	return this.getMilliseconds() - other.getMilliseconds();
};
oFF.XDate.prototype.getDayOfMonth = function()
{
	return this.m_day;
};
oFF.XDate.prototype.getDayOfWeek = function()
{
	if (!this.isNormalized())
	{
		this.m_dayOfWeek = oFF.XDate.FIELD_UNDEFINED;
	}
	return this.m_dayOfWeek;
};
oFF.XDate.prototype.getDaylightSavingInMilliseconds = function()
{
	return this.m_timeZone.getDSTSavings();
};
oFF.XDate.prototype.getEra = function()
{
	return this.m_era;
};
oFF.XDate.prototype.getGregorianYearFromFixedDate = function(fixedDate)
{
	let d0;
	let d1;
	let d2;
	let d3;
	let n400;
	let n100;
	let n4;
	let n1;
	let year;
	if (fixedDate > 0)
	{
		d0 = fixedDate - 1;
		n400 = oFF.XLong.convertToInt(oFF.XMath.longDiv(d0, 146097));
		d1 = oFF.XLong.convertToInt(oFF.XMath.longMod(d0, 146097));
		n100 = oFF.XMath.div(d1, 36524);
		d2 = oFF.XMath.mod(d1, 36524);
		n4 = oFF.XMath.div(d2, 1461);
		d3 = oFF.XMath.mod(d2, 1461);
		n1 = oFF.XMath.div(d3, 365);
	}
	else
	{
		d0 = fixedDate - 1;
		n400 = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longFloorDivide(d0, 146097));
		d1 = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longModFloor(d0, 146097));
		n100 = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longFloorDivide(d1, 36524));
		d2 = oFF.XAbstractCalendarDate.modFloor(d1, 36524);
		n4 = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longFloorDivide(d2, 1461));
		d3 = oFF.XAbstractCalendarDate.modFloor(d2, 1461);
		n1 = oFF.XLong.convertToInt(oFF.XAbstractCalendarDate.longFloorDivide(d3, 365));
	}
	year = 400 * n400 + 100 * n100 + 4 * n4 + n1;
	if (!(n100 === 4 || n1 === 4))
	{
		year = year + 1;
	}
	return year;
};
oFF.XDate.prototype.getMilliseconds = function()
{
	let gd = this.getFixedDate();
	let ms = (gd - oFF.XDate.EPOCH_OFFSET) * oFF.DateConstants.DAY_IN_MILLIS;
	let zoneOffset = 0;
	let zi = this.getTimeZone();
	if (oFF.notNull(zi))
	{
		if (this.isNormalized())
		{
			return ms - this.getTimeZoneOffsetInMilliseconds();
		}
		zoneOffset = zi.getOffset(ms - zi.getRawOffset());
	}
	ms = ms - zoneOffset;
	return ms;
};
oFF.XDate.prototype.getMonthOfYear = function()
{
	return this.m_month;
};
oFF.XDate.prototype.getNormalizedTime = function()
{
	return 0;
};
oFF.XDate.prototype.getQuarterOfYear = function()
{
	return this.m_month <= 3 ? 1 : this.m_month <= 6 ? 2 : this.m_month <= 9 ? 3 : 4;
};
oFF.XDate.prototype.getTimeZone = function()
{
	return this.m_timeZone;
};
oFF.XDate.prototype.getTimeZoneOffsetInMilliseconds = function()
{
	let offset = 0;
	if (oFF.notNull(this.m_timeZone))
	{
		offset = this.m_timeZone.getRawOffset();
	}
	return offset;
};
oFF.XDate.prototype.getValueType = function()
{
	return oFF.XValueType.DATE;
};
oFF.XDate.prototype.getYear = function()
{
	return this.m_year;
};
oFF.XDate.prototype.isDaylightTime = function()
{
	if (this.isStandardTime())
	{
		return false;
	}
	return this.m_daylightSaving !== 0;
};
oFF.XDate.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractCalendarDate.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return this.m_year === otherValue.m_year && this.m_month === otherValue.m_month && this.m_day === otherValue.m_day;
};
oFF.XDate.prototype.isLeapYear = function()
{
	return this.m_leapYear;
};
oFF.XDate.prototype.isStandardTime = function()
{
	return this.m_forceStandardTime;
};
oFF.XDate.prototype.normalizeMonth = function()
{
	let year = this.getYear();
	let month = this.getMonthOfYear();
	if (month <= 0)
	{
		let xm = 1 - month;
		year = oFF.XLong.convertToInt(year - (oFF.XMath.longDiv(xm, 12) + 1));
		month = 13 - oFF.XMath.longMod(xm, 12);
		this.setYear(year);
		this.setMonthOfYear(oFF.XLong.convertToInt(month));
	}
	else if (month > oFF.DateConstants.DECEMBER)
	{
		year = oFF.XLong.convertToInt(year + oFF.XMath.longDiv(month - 1, 12));
		month = oFF.XMath.longMod(month - 1, 12) + 1;
		this.setYear(year);
		this.setMonthOfYear(oFF.XLong.convertToInt(month));
	}
};
oFF.XDate.prototype.releaseObject = function()
{
	this.m_era = oFF.XObjectExt.release(this.m_era);
	this.m_timeZone = oFF.XObjectExt.release(this.m_timeZone);
	oFF.XAbstractCalendarDate.prototype.releaseObject.call( this );
};
oFF.XDate.prototype.resetValue = function(value)
{
	if (this !== value)
	{
		let originalValue = value;
		if (oFF.notNull(value) && value.getValueType() === oFF.XValueType.DATE_TIME)
		{
			originalValue = value.getDate();
		}
		oFF.XAbstractCalendarDate.prototype.resetValue.call( this , originalValue);
		let otherValue = originalValue;
		this.setYear(otherValue.m_year);
		this.setMonthOfYear(otherValue.m_month);
		this.setDayOfMonth(otherValue.m_day);
	}
};
oFF.XDate.prototype.setDate = function(year, monthOfYear, dayOfMonth)
{
	this.setYear(year);
	this.setMonthOfYear(monthOfYear);
	this.setDayOfMonth(dayOfMonth);
};
oFF.XDate.prototype.setDayOfMonth = function(day)
{
	if (this.m_day !== day)
	{
		this.m_day = day;
		this.setNormalized(false);
	}
};
oFF.XDate.prototype.setDayOfWeek = function(dayOfWeek)
{
	this.m_dayOfWeek = dayOfWeek;
};
oFF.XDate.prototype.setDaylightSavingInMilliseconds = function(daylightSavingInMilliseconds)
{
	this.m_daylightSaving = daylightSavingInMilliseconds;
};
oFF.XDate.prototype.setEra = function(era)
{
	this.m_era = era;
	this.setNormalized(false);
};
oFF.XDate.prototype.setLeapYear = function(leapYear)
{
	this.m_leapYear = leapYear;
};
oFF.XDate.prototype.setMonthOfYear = function(month)
{
	if (this.m_month !== month)
	{
		this.m_month = month;
		this.setNormalized(false);
	}
};
oFF.XDate.prototype.setTimeZone = function(timeZone)
{
	this.m_timeZone = timeZone;
	this.setNormalized(false);
};
oFF.XDate.prototype.setYear = function(year)
{
	if (year < 0)
	{
		throw oFF.XException.createIllegalArgumentException("illegal year");
	}
	this.m_year = year;
};
oFF.XDate.prototype.toIsoFormat = function()
{
	let buffer = oFF.XStringBuffer.create();
	let year = oFF.XInteger.convertToString(this.m_year);
	let size = oFF.XString.size(year);
	oFF.XDate.padWithZeros(buffer, size, 4);
	buffer.append(year);
	buffer.append("-");
	let month = oFF.XInteger.convertToString(this.m_month);
	size = oFF.XString.size(month);
	oFF.XDate.padWithZeros(buffer, size, 2);
	buffer.append(month);
	buffer.append("-");
	let day = oFF.XInteger.convertToString(this.m_day);
	size = oFF.XString.size(day);
	oFF.XDate.padWithZeros(buffer, size, 2);
	buffer.append(day);
	return buffer.toString();
};
oFF.XDate.prototype.toSAPFormat = function()
{
	let buffer = oFF.XStringBuffer.create();
	let year = oFF.XInteger.convertToString(this.m_year);
	let size = oFF.XString.size(year);
	oFF.XDate.padWithZeros(buffer, size, 4);
	buffer.append(year);
	let month = oFF.XInteger.convertToString(this.m_month);
	size = oFF.XString.size(month);
	oFF.XDate.padWithZeros(buffer, size, 2);
	buffer.append(month);
	let day = oFF.XInteger.convertToString(this.m_day);
	size = oFF.XString.size(day);
	oFF.XDate.padWithZeros(buffer, size, 2);
	buffer.append(day);
	return buffer.toString();
};
oFF.XDate.prototype.toString = function()
{
	return this.toIsoFormat();
};

oFF.XDateTime = function() {};
oFF.XDateTime.prototype = new oFF.XAbstractCalendarDate();
oFF.XDateTime.prototype._ff_c = "XDateTime";

oFF.XDateTime.EPOCH_OFFSET = 719163;
oFF.XDateTime.UTC = function(year, monthIn, day, hrs, min, sec)
{
	let result = oFF.XDateTime.createWithYearMonthDayHourMinuteSecond(year, monthIn, day, hrs, min, sec);
	return result.getTimeInMilliseconds();
};
oFF.XDateTime.create = function()
{
	return oFF.XDateTime.createCurrentLocalDateTime();
};
oFF.XDateTime.createCurrentLocalDateTime = function()
{
	let timezoneOffset = oFF.XSystemUtils.getSystemTimezoneOffsetInMilliseconds();
	let timeInMillis = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
	return oFF.XDateTime.createWithTimezoneAndMillis(timeInMillis, oFF.XSimpleTimeZone.createWithOffsetAndId(timezoneOffset, ""));
};
oFF.XDateTime.createDateTimeFromIsoFormat = function(dateTime)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTime))
	{
		let dateString = oFF.XString.substring(dateTime, 0, 10);
		let date = oFF.XDate.createDateFromIsoFormat(dateString);
		let resultInternal = null;
		if (oFF.notNull(date))
		{
			resultInternal = new oFF.XDateTime();
			resultInternal.m_date = date;
			if (oFF.XString.size(dateTime) <= oFF.XString.size(dateString))
			{
				resultInternal.m_time = oFF.XTime.createHollowTime();
			}
			else
			{
				let timeString = oFF.XString.substring(dateTime, 11, oFF.XString.size(dateTime));
				resultInternal.m_time = oFF.XTime.createTimeFromIsoFormat(timeString);
			}
			resultInternal.m_date.setTimeZone(oFF.XSimpleTimeZone.createFromIsoFormat(dateTime));
		}
		result = resultInternal;
	}
	else if (oFF.notNull(dateTime))
	{
		result = oFF.XEmptyDateTime.create();
	}
	return result;
};
oFF.XDateTime.createDateTimeFromSAPFormat = function(dateTime)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTime))
	{
		if (oFF.XString.size(dateTime) >= 8)
		{
			let dateString = oFF.XString.substring(dateTime, 0, 8);
			let date = oFF.XDate.createDateFromSAPFormat(dateString);
			if (oFF.notNull(date))
			{
				let resultInternal = new oFF.XDateTime();
				resultInternal.m_date = date;
				if (oFF.XString.size(dateTime) <= oFF.XString.size(dateString))
				{
					resultInternal.m_time = oFF.XTime.createHollowTime();
				}
				else
				{
					let timeString = oFF.XString.substring(dateTime, 8, 14);
					resultInternal.m_time = oFF.XTime.createTimeFromSAPFormat(timeString);
				}
				result = resultInternal;
			}
		}
		else if (oFF.XString.isEqual("#", dateTime))
		{
			result = oFF.XDateTime.createHollowDateTime();
		}
	}
	return result;
};
oFF.XDateTime.createDateTimeFromString = function(dateTime, valueFormat)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTime))
	{
		if (valueFormat === oFF.DateTimeFormat.ISO || oFF.isNull(valueFormat))
		{
			result = oFF.XDateTime.createDateTimeFromIsoFormat(dateTime);
		}
		else
		{
			result = oFF.XDateTime.createDateTimeFromSAPFormat(dateTime);
		}
	}
	return result;
};
oFF.XDateTime.createDateTimeFromStringWithFlag = function(dateTime, isSapFormat)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTime))
	{
		if (isSapFormat)
		{
			result = oFF.XDateTime.createDateTimeFromSAPFormat(dateTime);
		}
		else
		{
			result = oFF.XDateTime.createDateTimeFromIsoFormat(dateTime);
		}
	}
	return result;
};
oFF.XDateTime.createDateTimeSafe = function(dateTime)
{
	let result = null;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTime))
	{
		let date = null;
		let time = null;
		if (oFF.XString.size(dateTime) === 8 || oFF.XString.size(dateTime) === 10)
		{
			date = oFF.XDate.createDateSafe(dateTime);
		}
		else if (oFF.XString.size(dateTime) === 14)
		{
			date = oFF.XDate.createDateSafe(oFF.XString.substring(dateTime, 0, 8));
			time = oFF.XTime.createTimeSafe(oFF.XString.substring(dateTime, 8, 14));
		}
		else if (oFF.XString.size(dateTime) > 11)
		{
			date = oFF.XDate.createDateSafe(oFF.XString.substring(dateTime, 0, 10));
			time = oFF.XTime.createTimeSafe(oFF.XString.substring(dateTime, 11, -1));
		}
		else if (oFF.XString.isEqual("#", dateTime))
		{
			date = oFF.XDate.createHollowDate();
			time = oFF.XTime.createHollowTime();
		}
		if (oFF.notNull(date))
		{
			result = new oFF.XDateTime();
			if (oFF.isNull(time))
			{
				time = oFF.XTime.createHollowTime();
			}
			result.m_date = date;
			result.m_time = time;
		}
	}
	return result;
};
oFF.XDateTime.createDateTimeWithValues = function(year, month, day, hour, minute, second, millisecond)
{
	let result = oFF.XDateTime.createHollowDateTime();
	result.setYear(year);
	result.setMonthOfYear(month);
	result.setDayOfMonth(day);
	result.setHourOfDay(hour);
	result.setMinuteOfHour(minute);
	result.setSecondOfMinute(second);
	result.setMillisecondOfSecond(millisecond);
	return result;
};
oFF.XDateTime.createHollowDateTime = function()
{
	let result = new oFF.XDateTime();
	result.m_date = oFF.XDate.createHollowDate();
	result.m_time = oFF.XTime.createHollowTime();
	return result;
};
oFF.XDateTime.createWithEmptyTimezone = function()
{
	return oFF.XDateTime.createWithTimezone(oFF.XSimpleTimeZone.create());
};
oFF.XDateTime.createWithMillis = function(timeInMillis)
{
	return oFF.XDateTime.createWithTimezoneAndMillis(timeInMillis, oFF.XSimpleTimeZone.create());
};
oFF.XDateTime.createWithMilliseconds = function(milliseconds)
{
	let result = oFF.XDateTime.createWithTimezone(oFF.XSimpleTimeZone.create());
	let ms = 0;
	let saving = 0;
	let days = 0;
	result.setDaylightSavingInMilliseconds(saving);
	days = days + oFF.XMath.longDiv(milliseconds, oFF.DateConstants.DAY_IN_MILLIS);
	ms = ms + oFF.XLong.convertToInt(oFF.XMath.longMod(milliseconds, oFF.DateConstants.DAY_IN_MILLIS));
	if (ms >= oFF.DateConstants.DAY_IN_MILLIS)
	{
		ms = ms - oFF.DateConstants.DAY_IN_MILLIS;
	}
	else
	{
		while (ms < 0)
		{
			ms = ms + oFF.DateConstants.DAY_IN_MILLIS;
			days = days - 1;
		}
	}
	days = days + oFF.XDateTime.EPOCH_OFFSET;
	result.dateFromFixedDate(days);
	result.setTimeOfDayWithFraction(ms);
	result.setLeapYear(oFF.XGregorianCalendar.create().isLeapYear(result.getYear()));
	return result;
};
oFF.XDateTime.createWithTimezone = function(timeZone)
{
	let result = new oFF.XDateTime();
	result.m_time = oFF.XTime.createHollowTime();
	result.m_date = oFF.XDate.createWithTimeZone(timeZone);
	return result;
};
oFF.XDateTime.createWithTimezoneAndMillis = function(timeInMillis, timeZone)
{
	let calendar = oFF.XGregorianCalendar.createWithTimeZone(timeZone);
	calendar.setTimeInMillis(timeInMillis);
	let year = calendar.get(oFF.DateConstants.YEAR);
	let month = calendar.get(oFF.DateConstants.MONTH);
	let day = calendar.get(oFF.DateConstants.DAY_OF_MONTH);
	let hour = calendar.get(oFF.DateConstants.HOUR_OF_DAY);
	let minute = calendar.get(oFF.DateConstants.MINUTE);
	let second = calendar.get(oFF.DateConstants.SECOND);
	let millisecond = calendar.get(oFF.DateConstants.MILLISECOND);
	let dateTime = oFF.XDateTime.createDateTimeWithValues(year, month, day, hour, minute, second, millisecond);
	dateTime.setTimeZone(timeZone);
	return dateTime;
};
oFF.XDateTime.createWithYearMonthDay = function(year, month, day)
{
	let result = oFF.XDateTime.createWithTimezone(oFF.XSimpleTimeZone.create());
	result.setDate(year, month, day);
	return result;
};
oFF.XDateTime.createWithYearMonthDayHourMinuteSecond = function(year, monthIn, day, hours, mins, secs)
{
	let y = year + 1900;
	let result = oFF.XDateTime.createWithTimezone(null);
	result.setDate(y, monthIn, day);
	result.setTimeOfDay(hours, mins, secs, 0);
	return result;
};
oFF.XDateTime.prototype.m_date = null;
oFF.XDateTime.prototype.m_time = null;
oFF.XDateTime.prototype.addDate = function(year, month, dayOfMonth)
{
	this.addYears(year);
	this.addMonths(month);
	this.addDaysOfMonth(dayOfMonth);
};
oFF.XDateTime.prototype.addDaysOfMonth = function(daysToAdd)
{
	this.m_date.addDaysOfMonth(daysToAdd);
};
oFF.XDateTime.prototype.addHours = function(hoursToAdd)
{
	this.m_time.addHours(hoursToAdd);
};
oFF.XDateTime.prototype.addMilliseconds = function(millisToAdd)
{
	this.m_time.addMilliseconds(millisToAdd);
};
oFF.XDateTime.prototype.addMinutes = function(minutesToAdd)
{
	this.m_time.addMinutes(minutesToAdd);
};
oFF.XDateTime.prototype.addMonths = function(monthsToAdd)
{
	this.m_date.addMonths(monthsToAdd);
};
oFF.XDateTime.prototype.addSeconds = function(secondsToAdd)
{
	this.m_time.addSeconds(secondsToAdd);
};
oFF.XDateTime.prototype.addTimeOfDay = function(hours, minutes, seconds, millis)
{
	this.addHours(hours);
	this.addMinutes(minutes);
	this.addSeconds(seconds);
	this.addMilliseconds(millis);
};
oFF.XDateTime.prototype.addYears = function(yearsToAdd)
{
	this.m_date.addYears(yearsToAdd);
};
oFF.XDateTime.prototype.after = function(otherDateTime)
{
	if (oFF.isNull(otherDateTime))
	{
		throw oFF.XException.createIllegalArgumentException("otherDateTime cannot be null");
	}
	return this.getTimeInMilliseconds() > otherDateTime.getTimeInMilliseconds();
};
oFF.XDateTime.prototype.before = function(otherDateTime)
{
	if (oFF.isNull(otherDateTime))
	{
		throw oFF.XException.createIllegalArgumentException("otherDateTime cannot be null");
	}
	return this.getTimeInMilliseconds() < otherDateTime.getTimeInMilliseconds();
};
oFF.XDateTime.prototype.cloneExt = function(flags)
{
	let result = new oFF.XDateTime();
	result.m_date = this.m_date.clone();
	result.m_time = this.m_time.clone();
	return result;
};
oFF.XDateTime.prototype.compareTo = function(objectToCompare)
{
	let xOther = objectToCompare;
	let thisTime = this.getTimeInMilliseconds();
	let otherTime = xOther.getTimeInMilliseconds();
	if (thisTime < otherTime)
	{
		return -1;
	}
	else if (thisTime === otherTime)
	{
		return 0;
	}
	else
	{
		return 1;
	}
};
oFF.XDateTime.prototype.dateFromFixedDate = function(fixedDate)
{
	this.m_date.dateFromFixedDate(fixedDate);
};
oFF.XDateTime.prototype.difference = function(other)
{
	return this.getMilliseconds() - other.getMilliseconds();
};
oFF.XDateTime.prototype.getDate = function()
{
	return this.m_date;
};
oFF.XDateTime.prototype.getDayOfMonth = function()
{
	return this.m_date.getDayOfMonth();
};
oFF.XDateTime.prototype.getDayOfWeek = function()
{
	return this.m_date.getDayOfWeek();
};
oFF.XDateTime.prototype.getDayOfWeekAfter = function(fixedDate, dayOfWeek)
{
	return this.getDayOfWeekDateOnOrBefore(fixedDate + 7, dayOfWeek);
};
oFF.XDateTime.prototype.getDayOfWeekDateBefore = function(fixedDate, dayOfWeek)
{
	return this.getDayOfWeekDateOnOrBefore(fixedDate - 1, dayOfWeek);
};
oFF.XDateTime.prototype.getDayOfWeekDateOnOrBefore = function(fixedDate, dayOfWeek)
{
	let fd = fixedDate - (dayOfWeek - 1);
	if (fd >= 0)
	{
		return fixedDate - oFF.XMath.longMod(fd, 7);
	}
	return fixedDate - oFF.XAbstractCalendarDate.longModFloor(fd, 7);
};
oFF.XDateTime.prototype.getDaylightSavingInMilliseconds = function()
{
	return this.m_date.getDaylightSavingInMilliseconds();
};
oFF.XDateTime.prototype.getEra = function()
{
	return this.m_date.getEra();
};
oFF.XDateTime.prototype.getFractionsOfSecond = function()
{
	return this.m_time.getFractionsOfSecond();
};
oFF.XDateTime.prototype.getHourOfDay = function()
{
	return this.m_time.getHourOfDay();
};
oFF.XDateTime.prototype.getMillisecondOfSecond = function()
{
	return this.m_time.getMillisecondOfSecond();
};
oFF.XDateTime.prototype.getMilliseconds = function()
{
	let calendar = oFF.XGregorianCalendar.create();
	calendar.setDateTime(this);
	return calendar.getTimeInMillis();
};
oFF.XDateTime.prototype.getMinuteOfHour = function()
{
	return this.m_time.getMinuteOfHour();
};
oFF.XDateTime.prototype.getMonthLength = function()
{
	return oFF.DateConstants.DAYS_IN_MONTH.get(this.getMonthOfYear());
};
oFF.XDateTime.prototype.getMonthOfYear = function()
{
	return this.m_date.getMonthOfYear();
};
oFF.XDateTime.prototype.getNormalizedTime = function()
{
	return this.normalizeTime();
};
oFF.XDateTime.prototype.getQuarterOfYear = function()
{
	return this.m_date.getQuarterOfYear();
};
oFF.XDateTime.prototype.getSecondOfMinute = function()
{
	return this.m_time.getSecondOfMinute();
};
oFF.XDateTime.prototype.getTime = function()
{
	return this.m_time;
};
oFF.XDateTime.prototype.getTimeInMilliseconds = function()
{
	let gd = this.getFixedDate();
	let ms = (gd - oFF.XDateTime.EPOCH_OFFSET) * oFF.DateConstants.DAY_IN_MILLIS + this.m_time.getTimeInMilliseconds();
	let zoneOffset = 0;
	let zi = this.getTimeZone();
	if (oFF.notNull(zi))
	{
		if (this.isNormalized())
		{
			return ms - this.getTimeZoneOffsetInMilliseconds();
		}
		zoneOffset = zi.getOffset(ms - zi.getRawOffset());
	}
	ms = ms - zoneOffset;
	return ms;
};
oFF.XDateTime.prototype.getTimeZone = function()
{
	return this.m_date.getTimeZone();
};
oFF.XDateTime.prototype.getTimeZoneOffsetInMilliseconds = function()
{
	return this.m_date.getTimeZoneOffsetInMilliseconds();
};
oFF.XDateTime.prototype.getTimezoneOffsetString = function()
{
	let offsetString = "";
	let offsetInMillis = this.m_date.getTimeZoneOffsetInMilliseconds();
	if (this.isDaylightTime())
	{
		offsetInMillis = offsetInMillis + this.m_date.getDaylightSavingInMilliseconds();
	}
	if (offsetInMillis === 0)
	{
		offsetString = "Z";
	}
	else
	{
		let sign = "-";
		if (offsetInMillis >= 0)
		{
			sign = "+";
		}
		let hoursOffset = offsetInMillis / oFF.DateConstants.HOUR_IN_MILLIS;
		hoursOffset = oFF.XDouble.convertToInt(oFF.XMath.abs(hoursOffset));
		let remainderMinutes = oFF.XMath.mod(this.m_date.getTimeZoneOffsetInMilliseconds(), oFF.DateConstants.HOUR_IN_MILLIS);
		let minutesOffset = remainderMinutes / oFF.DateConstants.MINUTE_IN_MILLIS;
		offsetString = oFF.XStringUtils.concatenate4(sign, oFF.XStringUtils.addNumberPadded(hoursOffset, 2), ":", oFF.XStringUtils.addNumberPadded(minutesOffset, 2));
	}
	return offsetString;
};
oFF.XDateTime.prototype.getValueType = function()
{
	return oFF.XValueType.DATE_TIME;
};
oFF.XDateTime.prototype.getYear = function()
{
	return this.m_date.getYear();
};
oFF.XDateTime.prototype.isDaylightTime = function()
{
	if (this.getTimeZone() === null)
	{
		return false;
	}
	return this.getTimeZone().inDaylightTime(this);
};
oFF.XDateTime.prototype.isEqualTo = function(other)
{
	if (!oFF.XAbstractCalendarDate.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let otherValue = other;
	return this.m_date.isEqualTo(otherValue.m_date) && this.m_time.isEqualTo(otherValue.m_time);
};
oFF.XDateTime.prototype.isLeapYear = function()
{
	return this.m_date.isLeapYear();
};
oFF.XDateTime.prototype.isStandardTime = function()
{
	return this.m_date.isStandardTime();
};
oFF.XDateTime.prototype.normalizeMonth = function()
{
	let year = this.getYear();
	let month = this.getMonthOfYear();
	if (month <= 0)
	{
		let xm = 1 - month;
		year = oFF.XLong.convertToInt(year - (oFF.XMath.longDiv(xm, 12) + 1));
		month = 13 - oFF.XMath.longMod(xm, 12);
		this.setYear(year);
		this.setMonthOfYear(oFF.XLong.convertToInt(month));
	}
	else if (month > oFF.DateConstants.DECEMBER)
	{
		year = oFF.XLong.convertToInt(year + oFF.XMath.longDiv(month - 1, 12));
		month = oFF.XMath.longMod(month - 1, 12) + 1;
		this.setYear(year);
		this.setMonthOfYear(oFF.XLong.convertToInt(month));
	}
};
oFF.XDateTime.prototype.normalizeTime = function()
{
	return this.m_time.normalizeTime();
};
oFF.XDateTime.prototype.releaseObject = function()
{
	this.m_date = oFF.XObjectExt.release(this.m_date);
	this.m_time = oFF.XObjectExt.release(this.m_time);
	oFF.XAbstractCalendarDate.prototype.releaseObject.call( this );
};
oFF.XDateTime.prototype.resetValue = function(value)
{
	oFF.XObjectExt.assertNotNullExt(value, "illegal value");
	if (this !== value)
	{
		let otherValueType = value.getValueType();
		if (this.getValueType() !== otherValueType)
		{
			if (otherValueType === oFF.XValueType.DATE)
			{
				this.m_date.resetValue(value);
			}
			else if (otherValueType === oFF.XValueType.TIME)
			{
				this.m_time.resetValue(value);
			}
			else
			{
				throw oFF.XException.createIllegalArgumentException("illegal value");
			}
		}
		else
		{
			let otherValue = value;
			this.m_date.resetValue(otherValue.m_date);
			this.m_time.resetValue(otherValue.m_time);
		}
	}
};
oFF.XDateTime.prototype.setDate = function(year, monthOfYear, dayOfMonth)
{
	this.m_date.setDate(year, monthOfYear, dayOfMonth);
};
oFF.XDateTime.prototype.setDayOfMonth = function(day)
{
	this.m_date.setDayOfMonth(day);
};
oFF.XDateTime.prototype.setDayOfWeek = function(dayOfWeek)
{
	this.m_date.setDayOfWeek(dayOfWeek);
};
oFF.XDateTime.prototype.setDaylightSavingInMilliseconds = function(daylightSavingInMilliseconds)
{
	this.m_date.setDaylightSavingInMilliseconds(daylightSavingInMilliseconds);
};
oFF.XDateTime.prototype.setEra = function(era)
{
	this.m_date.setEra(era);
};
oFF.XDateTime.prototype.setFraction = function(fraction)
{
	this.m_time.setFraction(fraction);
};
oFF.XDateTime.prototype.setHourOfDay = function(hour)
{
	this.m_time.setHourOfDay(hour);
};
oFF.XDateTime.prototype.setLeapYear = function(leapYear)
{
	this.m_date.setLeapYear(leapYear);
};
oFF.XDateTime.prototype.setMillisecondOfSecond = function(millisecond)
{
	this.m_time.setMillisecondOfSecond(millisecond);
};
oFF.XDateTime.prototype.setMinuteOfHour = function(minute)
{
	this.m_time.setMinuteOfHour(minute);
};
oFF.XDateTime.prototype.setMonthOfYear = function(month)
{
	this.m_date.setMonthOfYear(month);
};
oFF.XDateTime.prototype.setNthDayOfWeek = function(dayOfMonth, dayOfWeek)
{
	this.normalize();
	let fixedDate = this.getFixedDate();
	let nfd;
	if (dayOfMonth > 0)
	{
		nfd = 7 * dayOfMonth + this.getDayOfWeekDateBefore(fixedDate, dayOfWeek);
	}
	else
	{
		nfd = 7 * dayOfMonth + this.getDayOfWeekAfter(fixedDate, dayOfWeek);
	}
	this.dateFromFixedDate(nfd);
};
oFF.XDateTime.prototype.setSecondOfMinute = function(second)
{
	this.m_time.setSecondOfMinute(second);
};
oFF.XDateTime.prototype.setTimeOfDay = function(hours, minutes, seconds, millis)
{
	this.setHourOfDay(hours);
	this.setMinuteOfHour(minutes);
	this.setSecondOfMinute(seconds);
	this.setMillisecondOfSecond(millis);
};
oFF.XDateTime.prototype.setTimeOfDayWithFraction = function(fraction)
{
	if (fraction < 0)
	{
		throw oFF.XException.createIllegalArgumentException("Fraction is ^0");
	}
	let normalizedState = this.isNormalized();
	let time = fraction;
	let hours = oFF.XMath.div(time, oFF.DateConstants.HOUR_IN_MILLIS);
	time = oFF.XMath.mod(time, oFF.DateConstants.HOUR_IN_MILLIS);
	let minutes = oFF.XMath.div(time, oFF.DateConstants.MINUTE_IN_MILLIS);
	time = oFF.XMath.mod(time, oFF.DateConstants.MINUTE_IN_MILLIS);
	let seconds = oFF.XMath.div(time, oFF.DateConstants.SECOND_IN_MILLIS);
	time = oFF.XMath.mod(time, oFF.DateConstants.SECOND_IN_MILLIS);
	this.setHourOfDay(hours);
	this.setMinuteOfHour(minutes);
	this.setSecondOfMinute(seconds);
	this.setMillisecondOfSecond(time);
	if (hours < 24 && normalizedState)
	{
		this.setNormalized(normalizedState);
	}
};
oFF.XDateTime.prototype.setTimeZone = function(timeZone)
{
	this.m_date.setTimeZone(timeZone);
};
oFF.XDateTime.prototype.setYear = function(year)
{
	this.m_date.setYear(year);
};
oFF.XDateTime.prototype.toIso8601Format = function()
{
	return oFF.XStringUtils.concatenate4(this.m_date.toIsoFormat(), "T", this.m_time.toIsoFormat(), this.getTimezoneOffsetString());
};
oFF.XDateTime.prototype.toIsoFormat = function()
{
	return oFF.XStringUtils.concatenate3(this.m_date.toIsoFormat(), "T", this.m_time.toIsoFormat());
};
oFF.XDateTime.prototype.toIsoFormatWithFractions = function(fractionSize)
{
	return oFF.XStringUtils.concatenate3(this.m_date.toIsoFormat(), "T", this.m_time.toIsoFormatWithFractions(fractionSize));
};
oFF.XDateTime.prototype.toSAPFormat = function()
{
	return oFF.XStringUtils.concatenate2(this.m_date.toSAPFormat(), this.m_time.toSAPFormat());
};
oFF.XDateTime.prototype.toString = function()
{
	return this.toIsoFormat();
};

oFF.XEmptyDateTime = function() {};
oFF.XEmptyDateTime.prototype = new oFF.XAbstractValue();
oFF.XEmptyDateTime.prototype._ff_c = "XEmptyDateTime";

oFF.XEmptyDateTime.create = function()
{
	return new oFF.XEmptyDateTime();
};
oFF.XEmptyDateTime.prototype.addDate = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addDaysOfMonth = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addHours = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addMilliseconds = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addMinutes = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addMonths = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addSeconds = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addTimeOfDay = oFF.noSupport;
oFF.XEmptyDateTime.prototype.addYears = oFF.noSupport;
oFF.XEmptyDateTime.prototype.after = oFF.noSupport;
oFF.XEmptyDateTime.prototype.before = oFF.noSupport;
oFF.XEmptyDateTime.prototype.cloneExt = function(flags)
{
	return new oFF.XEmptyDateTime();
};
oFF.XEmptyDateTime.prototype.dateFromFixedDate = oFF.noSupport;
oFF.XEmptyDateTime.prototype.difference = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getDate = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getDayOfMonth = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getDayOfWeek = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getDaylightSavingInMilliseconds = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getEra = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getFractionsOfSecond = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getHourOfDay = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getMillisecondOfSecond = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getMilliseconds = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getMinuteOfHour = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getMonthLength = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getMonthOfYear = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getQuarterOfYear = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getSecondOfMinute = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getTime = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getTimeInMilliseconds = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getTimeZone = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getTimeZoneOffsetInMilliseconds = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getTimezoneOffsetString = oFF.noSupport;
oFF.XEmptyDateTime.prototype.getValueType = function()
{
	return oFF.XValueType.DATE_TIME;
};
oFF.XEmptyDateTime.prototype.getYear = oFF.noSupport;
oFF.XEmptyDateTime.prototype.isDaylightTime = oFF.noSupport;
oFF.XEmptyDateTime.prototype.isLeapYear = oFF.noSupport;
oFF.XEmptyDateTime.prototype.isStandardTime = oFF.noSupport;
oFF.XEmptyDateTime.prototype.normalize = oFF.noSupport;
oFF.XEmptyDateTime.prototype.normalizeTime = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setDate = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setDayOfMonth = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setDayOfWeek = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setDaylightSavingInMilliseconds = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setEra = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setFraction = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setHourOfDay = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setLeapYear = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setMillisecondOfSecond = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setMinuteOfHour = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setMonthOfYear = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setNthDayOfWeek = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setSecondOfMinute = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setTimeOfDay = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setTimeOfDayWithFraction = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setTimeZone = oFF.noSupport;
oFF.XEmptyDateTime.prototype.setYear = oFF.noSupport;
oFF.XEmptyDateTime.prototype.toIso8601Format = function()
{
	return "";
};
oFF.XEmptyDateTime.prototype.toIsoFormat = function()
{
	return "";
};
oFF.XEmptyDateTime.prototype.toIsoFormatWithFractions = function(fractionSize)
{
	return "";
};
oFF.XEmptyDateTime.prototype.toSAPFormat = function()
{
	return "";
};
oFF.XEmptyDateTime.prototype.toString = function()
{
	return this.toIsoFormat();
};

oFF.XBiConsumerCollection = function() {};
oFF.XBiConsumerCollection.prototype = new oFF.DfXLambdaCollection();
oFF.XBiConsumerCollection.prototype._ff_c = "XBiConsumerCollection";

oFF.XBiConsumerCollection.create = function()
{
	let collectionInstance = new oFF.XBiConsumerCollection();
	collectionInstance.setupExt();
	return collectionInstance;
};
oFF.XBiConsumerCollection.prototype.accept = function(t, u)
{
	oFF.XCollectionUtils.forEach(this.getValuesAsReadOnlyList(), (tmpConsumer) => {
		tmpConsumer(t, u);
	});
};
oFF.XBiConsumerCollection.prototype.addConsumer = function(consumer)
{
	return this.addLambda(consumer);
};
oFF.XBiConsumerCollection.prototype.getLambdaTypeName = function()
{
	return "biConsumer";
};
oFF.XBiConsumerCollection.prototype.removeConsumerByUuid = function(uuid)
{
	this.removeLambdaByUuid(uuid);
};

oFF.XBiFunctionCollection = function() {};
oFF.XBiFunctionCollection.prototype = new oFF.DfXLambdaCollection();
oFF.XBiFunctionCollection.prototype._ff_c = "XBiFunctionCollection";

oFF.XBiFunctionCollection.create = function()
{
	let collectionInstance = new oFF.XBiFunctionCollection();
	collectionInstance.setupExt();
	return collectionInstance;
};
oFF.XBiFunctionCollection.prototype.addBiFunction = function(_function)
{
	return this.addLambda(_function);
};
oFF.XBiFunctionCollection.prototype.apply = function(i1, i2)
{
	return oFF.XCollectionUtils.map(this.getValuesAsReadOnlyList(), (tmpFunction) => {
		return tmpFunction(i1, i2);
	});
};
oFF.XBiFunctionCollection.prototype.getLambdaTypeName = function()
{
	return "biFunction";
};
oFF.XBiFunctionCollection.prototype.prependBiFunction = function(_function)
{
	return this.prependLambda(_function);
};
oFF.XBiFunctionCollection.prototype.removeBiFunctionByUuid = function(uuid)
{
	this.removeLambdaByUuid(uuid);
};

oFF.XConsumerCollection = function() {};
oFF.XConsumerCollection.prototype = new oFF.DfXLambdaCollection();
oFF.XConsumerCollection.prototype._ff_c = "XConsumerCollection";

oFF.XConsumerCollection.create = function()
{
	let collectionInstance = new oFF.XConsumerCollection();
	collectionInstance.setupExt();
	return collectionInstance;
};
oFF.XConsumerCollection.prototype.accept = function(t)
{
	oFF.XCollectionUtils.forEach(this.getValuesAsReadOnlyList(), (tmpConsumer) => {
		tmpConsumer(t);
	});
};
oFF.XConsumerCollection.prototype.addConsumer = function(consumer)
{
	return this.addLambda(consumer);
};
oFF.XConsumerCollection.prototype.getLambdaTypeName = function()
{
	return "consumer";
};
oFF.XConsumerCollection.prototype.prependConsumer = function(consumer)
{
	return this.prependLambda(consumer);
};
oFF.XConsumerCollection.prototype.removeConsumerByUuid = function(uuid)
{
	this.removeLambdaByUuid(uuid);
};

oFF.XFunctionCollection = function() {};
oFF.XFunctionCollection.prototype = new oFF.DfXLambdaCollection();
oFF.XFunctionCollection.prototype._ff_c = "XFunctionCollection";

oFF.XFunctionCollection.create = function()
{
	let collectionInstance = new oFF.XFunctionCollection();
	collectionInstance.setupExt();
	return collectionInstance;
};
oFF.XFunctionCollection.prototype.addFunction = function(_function)
{
	return this.addLambda(_function);
};
oFF.XFunctionCollection.prototype.apply = function(i)
{
	return oFF.XCollectionUtils.map(this.getValuesAsReadOnlyList(), (tmpFunction) => {
		return tmpFunction(i);
	});
};
oFF.XFunctionCollection.prototype.getLambdaTypeName = function()
{
	return "function";
};
oFF.XFunctionCollection.prototype.prependFunction = function(_function)
{
	return this.prependLambda(_function);
};
oFF.XFunctionCollection.prototype.removeFunctionByUuid = function(uuid)
{
	this.removeLambdaByUuid(uuid);
};

oFF.XProcedureCollection = function() {};
oFF.XProcedureCollection.prototype = new oFF.DfXLambdaCollection();
oFF.XProcedureCollection.prototype._ff_c = "XProcedureCollection";

oFF.XProcedureCollection.create = function()
{
	let collectionInstance = new oFF.XProcedureCollection();
	collectionInstance.setupExt();
	return collectionInstance;
};
oFF.XProcedureCollection.prototype.addProcedure = function(procedure)
{
	return this.addLambda(procedure);
};
oFF.XProcedureCollection.prototype.execute = function()
{
	oFF.XCollectionUtils.forEach(this.getValuesAsReadOnlyList(), (tmpProcedure) => {
		tmpProcedure();
	});
};
oFF.XProcedureCollection.prototype.getLambdaTypeName = function()
{
	return "procedure";
};
oFF.XProcedureCollection.prototype.prependProcedure = function(procedure)
{
	return this.prependLambda(procedure);
};
oFF.XProcedureCollection.prototype.removeProcedureByUuid = function(uuid)
{
	this.removeLambdaByUuid(uuid);
};

oFF.XSupplierCollection = function() {};
oFF.XSupplierCollection.prototype = new oFF.DfXLambdaCollection();
oFF.XSupplierCollection.prototype._ff_c = "XSupplierCollection";

oFF.XSupplierCollection.create = function()
{
	let collectionInstance = new oFF.XSupplierCollection();
	collectionInstance.setupExt();
	return collectionInstance;
};
oFF.XSupplierCollection.prototype.addSupplier = function(supplier)
{
	return this.addLambda(supplier);
};
oFF.XSupplierCollection.prototype.get = function()
{
	return oFF.XCollectionUtils.map(this.getValuesAsReadOnlyList(), (tmpSupplier) => {
		return tmpSupplier();
	});
};
oFF.XSupplierCollection.prototype.getLambdaTypeName = function()
{
	return "supplier";
};
oFF.XSupplierCollection.prototype.prependSupplier = function(supplier)
{
	return this.prependLambda(supplier);
};
oFF.XSupplierCollection.prototype.removeSupplierByUuid = function(uuid)
{
	this.removeLambdaByUuid(uuid);
};

oFF.RgCellType = function() {};
oFF.RgCellType.prototype = new oFF.XConstantWithParent();
oFF.RgCellType.prototype._ff_c = "RgCellType";

oFF.RgCellType.ANCHOR_CELL = null;
oFF.RgCellType.CELL = null;
oFF.RgCellType.CONTENT = null;
oFF.RgCellType.DATA = null;
oFF.RgCellType.HEADER = null;
oFF.RgCellType.HEAD_AREA = null;
oFF.RgCellType.HIERARCHY = null;
oFF.RgCellType.REAL_CELL = null;
oFF.RgCellType.SCALING = null;
oFF.RgCellType.SELECT = null;
oFF.RgCellType.SELECT_COLUMNS = null;
oFF.RgCellType.SELECT_ROWS = null;
oFF.RgCellType.TITLE = null;
oFF.RgCellType.TWIN = null;
oFF.RgCellType.create = function(name, parent)
{
	let object = new oFF.RgCellType();
	object.setupExt(name, parent);
	return object;
};
oFF.RgCellType.staticSetup = function()
{
	oFF.RgCellType.CELL = oFF.RgCellType.create("CELL", null);
	oFF.RgCellType.REAL_CELL = oFF.RgCellType.create("REAL_CELL", oFF.RgCellType.CELL);
	oFF.RgCellType.ANCHOR_CELL = oFF.RgCellType.create("ANCHOR_CELL", oFF.RgCellType.CELL);
	oFF.RgCellType.CONTENT = oFF.RgCellType.create("CONTENT", oFF.RgCellType.REAL_CELL);
	oFF.RgCellType.SELECT = oFF.RgCellType.create("SELECT", oFF.RgCellType.REAL_CELL);
	oFF.RgCellType.HEAD_AREA = oFF.RgCellType.create("HEAD_AREA", oFF.RgCellType.CONTENT);
	oFF.RgCellType.TITLE = oFF.RgCellType.create("TITLE", oFF.RgCellType.HEAD_AREA);
	oFF.RgCellType.TWIN = oFF.RgCellType.create("TWIN", oFF.RgCellType.TITLE);
	oFF.RgCellType.HEADER = oFF.RgCellType.create("HEADER", oFF.RgCellType.HEAD_AREA);
	oFF.RgCellType.HIERARCHY = oFF.RgCellType.create("HIERARCHY", oFF.RgCellType.HEADER);
	oFF.RgCellType.SCALING = oFF.RgCellType.create("SCALING", oFF.RgCellType.HEADER);
	oFF.RgCellType.SELECT_ROWS = oFF.RgCellType.create("SELECT_ROWS", oFF.RgCellType.SELECT);
	oFF.RgCellType.SELECT_COLUMNS = oFF.RgCellType.create("SELECT_COLUMNS", oFF.RgCellType.SELECT);
	oFF.RgCellType.DATA = oFF.RgCellType.create("DATA", oFF.RgCellType.CONTENT);
};

oFF.XTrace = function() {};
oFF.XTrace.prototype = new oFF.XObject();
oFF.XTrace.prototype._ff_c = "XTrace";

oFF.XTrace.create = function()
{
	let param = new oFF.XTrace();
	param.setup();
	return param;
};
oFF.XTrace.prototype.m_signature = null;
oFF.XTrace.prototype.m_valueTraces = null;
oFF.XTrace.prototype.addBoolean = function(value)
{
	return this.addString(oFF.XBoolean.convertToString(value));
};
oFF.XTrace.prototype.addDouble = function(value)
{
	return this.addString(oFF.XDouble.convertToString(value));
};
oFF.XTrace.prototype.addInteger = function(value)
{
	return this.addString(oFF.XInteger.convertToString(value));
};
oFF.XTrace.prototype.addLong = function(value)
{
	return this.addString(oFF.XLong.convertToString(value));
};
oFF.XTrace.prototype.addNameObject = function(value)
{
	if (oFF.isNull(value))
	{
		return this.addString(null);
	}
	return this.addString(value.getName());
};
oFF.XTrace.prototype.addString = function(value)
{
	this.m_valueTraces.add(value);
	return this;
};
oFF.XTrace.prototype.addStringList = function(list)
{
	let buffer = oFF.XStringBuffer.create();
	let len = list.size();
	buffer.append("[");
	for (let i = 0; i < len; i++)
	{
		buffer.append(list.get(i));
		if (i + 1 < len)
		{
			buffer.append(",");
		}
	}
	buffer.append("]");
	this.addString(buffer.toString());
	return this;
};
oFF.XTrace.prototype.addXValue = function(value)
{
	if (oFF.isNull(value))
	{
		return this.addString(null);
	}
	return this.addString(value.getStringRepresentation());
};
oFF.XTrace.prototype.contains = function(element)
{
	return this.m_valueTraces.contains(element);
};
oFF.XTrace.prototype.createListCopy = function()
{
	return this.m_valueTraces.createListCopy();
};
oFF.XTrace.prototype.get = function(index)
{
	return this.m_valueTraces.get(index);
};
oFF.XTrace.prototype.getIndex = function(element)
{
	return this.m_valueTraces.getIndex(element);
};
oFF.XTrace.prototype.getIterator = function()
{
	return this.m_valueTraces.getIterator();
};
oFF.XTrace.prototype.getSignature = function()
{
	return this.m_signature;
};
oFF.XTrace.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_valueTraces.getValuesAsReadOnlyList();
};
oFF.XTrace.prototype.hasElements = function()
{
	return this.m_valueTraces.hasElements();
};
oFF.XTrace.prototype.isEmpty = function()
{
	return this.m_valueTraces.isEmpty();
};
oFF.XTrace.prototype.releaseObject = function()
{
	this.m_valueTraces = oFF.XObjectExt.release(this.m_valueTraces);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XTrace.prototype.setSignature = function(signature)
{
	this.m_signature = signature;
};
oFF.XTrace.prototype.setup = function()
{
	this.m_valueTraces = oFF.XList.create();
};
oFF.XTrace.prototype.size = function()
{
	return this.m_valueTraces.size();
};
oFF.XTrace.prototype.toString = function()
{
	return this.m_valueTraces.toString();
};

oFF.AbstractMultiGeometry = function() {};
oFF.AbstractMultiGeometry.prototype = new oFF.AbstractGeometry();
oFF.AbstractMultiGeometry.prototype._ff_c = "AbstractMultiGeometry";

oFF.AbstractMultiGeometry.prototype.m_list = null;
oFF.AbstractMultiGeometry.prototype.add = function(element)
{
	this.m_list.add(element);
};
oFF.AbstractMultiGeometry.prototype.addAll = function(other)
{
	if (oFF.notNull(other) && other !== this)
	{
		this.m_list.addAll(other);
	}
};
oFF.AbstractMultiGeometry.prototype.clear = function()
{
	this.m_list.clear();
};
oFF.AbstractMultiGeometry.prototype.cloneInternal = function(clone)
{
	oFF.XCollectionUtils.addAllClones(clone, this.m_list);
	clone.setSrid(this.getSrid());
};
oFF.AbstractMultiGeometry.prototype.contains = function(element)
{
	return this.m_list.contains(element);
};
oFF.AbstractMultiGeometry.prototype.createArrayCopy = function()
{
	return this.m_list.createArrayCopy();
};
oFF.AbstractMultiGeometry.prototype.createListCopy = function()
{
	return this.m_list.createListCopy();
};
oFF.AbstractMultiGeometry.prototype.get = function(index)
{
	return this.m_list.get(index);
};
oFF.AbstractMultiGeometry.prototype.getIndex = function(element)
{
	return this.m_list.getIndex(element);
};
oFF.AbstractMultiGeometry.prototype.getIterator = function()
{
	return this.m_list.getIterator();
};
oFF.AbstractMultiGeometry.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_list.getValuesAsReadOnlyList();
};
oFF.AbstractMultiGeometry.prototype.hasElements = function()
{
	return this.m_list.hasElements();
};
oFF.AbstractMultiGeometry.prototype.insert = function(index, element)
{
	this.m_list.insert(index, element);
};
oFF.AbstractMultiGeometry.prototype.isEmpty = function()
{
	return this.m_list.isEmpty();
};
oFF.AbstractMultiGeometry.prototype.releaseObject = function()
{
	this.m_list = oFF.XObjectExt.release(this.m_list);
	oFF.AbstractGeometry.prototype.releaseObject.call( this );
};
oFF.AbstractMultiGeometry.prototype.removeAt = function(index)
{
	return this.m_list.removeAt(index);
};
oFF.AbstractMultiGeometry.prototype.removeElement = function(element)
{
	return this.m_list.removeElement(element);
};
oFF.AbstractMultiGeometry.prototype.resetValueInternal = function(value)
{
	this.m_list.clear();
	this.m_list.addAll(value);
};
oFF.AbstractMultiGeometry.prototype.set = function(index, element)
{
	this.m_list.set(index, element);
};
oFF.AbstractMultiGeometry.prototype.setup = function()
{
	this.m_list = oFF.XList.create();
};
oFF.AbstractMultiGeometry.prototype.size = function()
{
	return this.m_list.size();
};
oFF.AbstractMultiGeometry.prototype.toString = function()
{
	let returnString = oFF.XStringBuffer.create();
	for (let i = 0; i < this.m_list.size(); i++)
	{
		if (i > 0)
		{
			returnString.append(",");
		}
		let geometry = this.m_list.get(i);
		returnString.append(geometry.toString());
	}
	return returnString.toString();
};

oFF.XPointValue = function() {};
oFF.XPointValue.prototype = new oFF.AbstractGeometry();
oFF.XPointValue.prototype._ff_c = "XPointValue";

oFF.XPointValue.WKT_START = "POINT";
oFF.XPointValue.create = function()
{
	return new oFF.XPointValue();
};
oFF.XPointValue.createWithPosition = function(posX, posY)
{
	let point = oFF.XPointValue.create();
	point.setXPosition(posX);
	point.setYPosition(posY);
	return point;
};
oFF.XPointValue.createWithPositionAndSrid = function(posX, posY, srid)
{
	let point = oFF.XPointValue.create();
	point.setXPosition(posX);
	point.setYPosition(posY);
	point.setSrid(oFF.XIntegerValue.create(srid));
	return point;
};
oFF.XPointValue.createWithPositionDc = function(posX, posY)
{
	let point = oFF.XPointValue.create();
	point.setXPositionDc(posX);
	point.setYPositionDc(posY);
	return point;
};
oFF.XPointValue.createWithWkt = function(wkt)
{
	if (oFF.isNull(wkt) || oFF.XString.indexOf(wkt, oFF.XPointValue.WKT_START) === -1 || oFF.XString.startsWith(wkt, "MULTIPOINT"))
	{
		return null;
	}
	let point = oFF.XPointValue.create();
	let openingParenthesis = oFF.XString.indexOf(wkt, "(");
	let closingParenthesis = oFF.XString.indexOf(wkt, ")");
	let stringCoordinates = oFF.XString.trim(oFF.XString.substring(wkt, openingParenthesis + 1, closingParenthesis));
	let spaceIndex = oFF.XString.indexOf(stringCoordinates, " ");
	let strX = oFF.XString.substring(stringCoordinates, 0, spaceIndex);
	let strY = oFF.XString.substring(stringCoordinates, spaceIndex + 1, oFF.XString.size(stringCoordinates));
	let xPos = oFF.XDecFloatByString.create(strX);
	let yPos = oFF.XDecFloatByString.create(strY);
	point.setXPositionDc(xPos);
	point.setYPositionDc(yPos);
	return point;
};
oFF.XPointValue.prototype.m_xPosition = null;
oFF.XPointValue.prototype.m_yPosition = null;
oFF.XPointValue.prototype.cloneExt = function(flags)
{
	let clone = oFF.XPointValue.createWithPositionDc(this.m_xPosition, this.m_yPosition);
	clone.setSrid(this.getSrid());
	return clone;
};
oFF.XPointValue.prototype.getValueType = function()
{
	return oFF.XValueType.POINT;
};
oFF.XPointValue.prototype.getXPosition = function()
{
	return this.m_xPosition.getDouble();
};
oFF.XPointValue.prototype.getYPosition = function()
{
	return this.m_yPosition.getDouble();
};
oFF.XPointValue.prototype.isEqualTo = function(other)
{
	if (!oFF.AbstractGeometry.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let xOther = other;
	return this.getXPosition() === xOther.getXPosition() && this.getYPosition() === xOther.getYPosition();
};
oFF.XPointValue.prototype.resetValue = function(value)
{
	oFF.AbstractGeometry.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let otherValue = value;
	this.m_xPosition = otherValue.m_xPosition;
	this.m_yPosition = otherValue.m_yPosition;
};
oFF.XPointValue.prototype.setXPosition = function(posX)
{
	this.m_xPosition = oFF.XDecFloatByDouble.create(posX);
};
oFF.XPointValue.prototype.setXPositionDc = function(posX)
{
	this.m_xPosition = posX;
};
oFF.XPointValue.prototype.setYPosition = function(posY)
{
	this.m_yPosition = oFF.XDecFloatByDouble.create(posY);
};
oFF.XPointValue.prototype.setYPositionDc = function(posY)
{
	this.m_yPosition = posY;
};
oFF.XPointValue.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	sb.append(this.m_xPosition.getStringRepresentation()).append(" ").append(this.m_yPosition.getStringRepresentation());
	return sb.toString();
};
oFF.XPointValue.prototype.toWKT = function()
{
	return oFF.XStringUtils.concatenate4(oFF.XPointValue.WKT_START, " (", this.toString(), ")");
};

oFF.XPolygonValue = function() {};
oFF.XPolygonValue.prototype = new oFF.AbstractGeometry();
oFF.XPolygonValue.prototype._ff_c = "XPolygonValue";

oFF.XPolygonValue.WKT_END = "))";
oFF.XPolygonValue.WKT_START = "POLYGON";
oFF.XPolygonValue.areCircuitsEqual = function(circuit1, circuit2)
{
	if (circuit1.size() !== circuit2.size())
	{
		return false;
	}
	for (let pointIdx = 0; pointIdx < circuit1.size(); pointIdx++)
	{
		if (!circuit1.get(pointIdx).isEqualTo(circuit2.get(pointIdx)))
		{
			return false;
		}
	}
	return true;
};
oFF.XPolygonValue.circuitToString = function(circuit)
{
	let sb = oFF.XStringBuffer.create();
	sb.append("(");
	for (let i = 0; i < circuit.size(); i++)
	{
		if (i > 0)
		{
			sb.append(", ");
		}
		sb.append(circuit.get(i).toString());
	}
	sb.append(")");
	return sb.toString();
};
oFF.XPolygonValue.create = function()
{
	let polygon = new oFF.XPolygonValue();
	polygon.setup();
	return polygon;
};
oFF.XPolygonValue.createWithWkt = function(wkt)
{
	if (oFF.isNull(wkt) || !oFF.XString.startsWith(wkt, oFF.XPolygonValue.WKT_START))
	{
		return null;
	}
	let polygon = oFF.XPolygonValue.create();
	let openingParenthesis = oFF.XString.indexOf(wkt, "((");
	let closingParenthesis = oFF.XString.indexOf(wkt, oFF.XPolygonValue.WKT_END);
	let stringCoordinates = oFF.XString.substring(wkt, openingParenthesis + 2, closingParenthesis);
	let stringCircuits = oFF.XStringTokenizer.splitString(stringCoordinates, ")");
	let circuitIterator = stringCircuits.getIterator();
	let isHull = true;
	while (circuitIterator.hasNext())
	{
		let stringCircuit = circuitIterator.next();
		let hole = null;
		if (!isHull)
		{
			hole = oFF.XList.create();
		}
		let indexOf = oFF.XString.indexOf(stringCircuit, "(");
		if (indexOf > 0)
		{
			stringCircuit = oFF.XString.substring(stringCircuit, indexOf + 1, oFF.XString.size(stringCircuit));
		}
		let listCoordinates;
		if (oFF.XString.indexOf(stringCircuit, ", ") !== -1)
		{
			listCoordinates = oFF.XStringTokenizer.splitString(stringCircuit, ", ");
		}
		else
		{
			listCoordinates = oFF.XStringTokenizer.splitString(stringCircuit, ",");
		}
		let pointIterator = listCoordinates.getIterator();
		while (pointIterator.hasNext())
		{
			let pointString = pointIterator.next();
			let pointCoordinates = oFF.XStringTokenizer.splitString(oFF.XString.trim(pointString), " ");
			let point = oFF.XPointValue.create();
			point.setXPositionDc(oFF.XDecFloatByString.create(pointCoordinates.get(0)));
			point.setYPositionDc(oFF.XDecFloatByString.create(pointCoordinates.get(1)));
			if (isHull)
			{
				polygon.getHull().add(point);
			}
			else
			{
				hole.add(point);
			}
		}
		if (!isHull)
		{
			polygon.getHoles().add(hole);
		}
		isHull = false;
	}
	return polygon;
};
oFF.XPolygonValue.prototype.m_holes = null;
oFF.XPolygonValue.prototype.m_hull = null;
oFF.XPolygonValue.prototype.cloneExt = function(flags)
{
	let clone = oFF.XPolygonValue.create();
	clone.getHull().addAll(this.m_hull);
	clone.getHoles().addAll(this.m_holes);
	clone.setSrid(this.getSrid());
	return clone;
};
oFF.XPolygonValue.prototype.getHoles = function()
{
	return this.m_holes;
};
oFF.XPolygonValue.prototype.getHull = function()
{
	return this.m_hull;
};
oFF.XPolygonValue.prototype.getPoints = function()
{
	return this.m_hull;
};
oFF.XPolygonValue.prototype.getValueType = function()
{
	return oFF.XValueType.POLYGON;
};
oFF.XPolygonValue.prototype.isEqualTo = function(other)
{
	if (!oFF.AbstractGeometry.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let xOther = other;
	if (!oFF.XPolygonValue.areCircuitsEqual(this.getPoints(), xOther.getPoints()))
	{
		return false;
	}
	for (let holeIdx = 0; holeIdx < this.getHoles().size(); holeIdx++)
	{
		let currentHole = this.getHoles().get(holeIdx);
		let otherHole = xOther.getHoles().get(holeIdx);
		if (!oFF.XPolygonValue.areCircuitsEqual(currentHole, otherHole))
		{
			return false;
		}
	}
	return true;
};
oFF.XPolygonValue.prototype.releaseObject = function()
{
	this.m_holes = oFF.XObjectExt.release(this.m_holes);
	this.m_hull = oFF.XObjectExt.release(this.m_hull);
	oFF.AbstractGeometry.prototype.releaseObject.call( this );
};
oFF.XPolygonValue.prototype.resetValue = function(value)
{
	oFF.AbstractGeometry.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	let valuePolygon = value;
	this.m_hull.clear();
	this.m_hull.addAll(valuePolygon.getPoints());
	this.m_holes.clear();
	this.m_holes.addAll(valuePolygon.getHoles());
};
oFF.XPolygonValue.prototype.setup = function()
{
	this.m_hull = oFF.XList.create();
	this.m_holes = oFF.XList.create();
};
oFF.XPolygonValue.prototype.toString = function()
{
	let sb = oFF.XStringBuffer.create();
	sb.append("(").append(oFF.XPolygonValue.circuitToString(this.m_hull));
	let circuitIterator = this.m_holes.getIterator();
	while (circuitIterator.hasNext())
	{
		sb.append(", ").append(oFF.XPolygonValue.circuitToString(circuitIterator.next()));
	}
	sb.append(")");
	return sb.toString();
};
oFF.XPolygonValue.prototype.toWKT = function()
{
	return oFF.XStringUtils.concatenate3(oFF.XPolygonValue.WKT_START, " ", this.toString());
};

oFF.XEnvironment = function() {};
oFF.XEnvironment.prototype = new oFF.DfAbstractMapByString();
oFF.XEnvironment.prototype._ff_c = "XEnvironment";

oFF.XEnvironment.BACK_SLASH = "\\";
oFF.XEnvironment.SLASH = "/";
oFF.XEnvironment.VAR_END = "}";
oFF.XEnvironment.VAR_START = "${";
oFF.XEnvironment.s_environmentObj = null;
oFF.XEnvironment.create = function()
{
	let newObj = new oFF.XEnvironment();
	newObj.setup();
	return newObj;
};
oFF.XEnvironment.createCopy = function(env)
{
	let newObj = oFF.XEnvironment.create();
	let variableNames = env.getVariableNames();
	for (let i = 0; i < variableNames.size(); i++)
	{
		let key = variableNames.get(i);
		let value = env.getVariable(key);
		newObj.setVariable(key, value);
	}
	let allLockedProperties = env.getAllLockableProperties();
	let lockedProperties = allLockedProperties.getValuesAsReadOnlyList();
	for (let k = 0; k < lockedProperties.size(); k++)
	{
		newObj.addLockableProperty(lockedProperties.get(k));
	}
	if (env.isLocking())
	{
		newObj.enableLocking();
	}
	return newObj;
};
oFF.XEnvironment.createFromSystemEnv = function()
{
	let newObj = oFF.XEnvironment.create();
	newObj.retrieveNativeEnv();
	return newObj;
};
oFF.XEnvironment.getInstance = function()
{
	if (oFF.isNull(oFF.XEnvironment.s_environmentObj))
	{
		oFF.XEnvironment.s_environmentObj = oFF.XEnvironment.createFromSystemEnv();
	}
	return oFF.XEnvironment.s_environmentObj;
};
oFF.XEnvironment.normalizeKey = function(key)
{
	let name = key;
	if (oFF.notNull(name))
	{
		name = oFF.XString.toLowerCase(key);
		if (oFF.XString.isEqual(name, ""))
		{
			name = null;
		}
	}
	return name;
};
oFF.XEnvironment.prototype.m_isLocked = false;
oFF.XEnvironment.prototype.m_lockableProperties = null;
oFF.XEnvironment.prototype.m_logWriter = null;
oFF.XEnvironment.prototype.m_properties = null;
oFF.XEnvironment.prototype._export = function(exportExp)
{
	let envVarExp = oFF.XStringTokenizer.splitString(exportExp, "=");
	if (oFF.notNull(envVarExp) && envVarExp.size() === 2)
	{
		let envVarKey = envVarExp.get(0);
		let envVarValue = envVarExp.get(1);
		let isOverwrite = oFF.XString.startsWith(envVarKey, "!");
		if (isOverwrite)
		{
			envVarKey = oFF.XString.substring(envVarKey, 1, -1);
		}
		if (!this.hasVariable(envVarKey) || isOverwrite)
		{
			this.setVariable(envVarKey, envVarValue);
		}
	}
};
oFF.XEnvironment.prototype.addLockableProperty = function(name)
{
	this.m_lockableProperties.add(name);
};
oFF.XEnvironment.prototype.assertNotLocked = function(name)
{
	if (this.isVariableLocked(name))
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Not allowed to change environment variable ", name));
	}
};
oFF.XEnvironment.prototype.clear = function()
{
	let values = this.m_lockableProperties.getValuesAsReadOnlyList();
	for (let i = 0; i < values.size(); i++)
	{
		let key = values.get(i);
		if (this.m_properties.containsKey(key))
		{
			throw oFF.XException.createIllegalStateException("Locked keys inside environment, cannot clear all");
		}
	}
	this.m_properties.clear();
};
oFF.XEnvironment.prototype.clearLockableProperties = function()
{
	let values = this.m_lockableProperties.getValuesAsReadOnlyList();
	for (let k = 0; k < values.size(); k++)
	{
		this.m_properties.remove(values.get(k));
	}
};
oFF.XEnvironment.prototype.contains = function(element)
{
	return this.m_properties.contains(element);
};
oFF.XEnvironment.prototype.containsKey = function(key)
{
	let contains = false;
	let targetKey = oFF.XEnvironment.normalizeKey(key);
	if (oFF.notNull(targetKey))
	{
		contains = this.m_properties.containsKey(targetKey);
	}
	return contains;
};
oFF.XEnvironment.prototype.createMapByStringCopy = function()
{
	return this.m_properties.createMapByStringCopy();
};
oFF.XEnvironment.prototype.enableLocking = function()
{
	this.m_isLocked = true;
};
oFF.XEnvironment.prototype.generateString = function(resolve)
{
	let buffer = oFF.XStringBuffer.create();
	let variableNames = this.getVariableNames();
	if (oFF.notNull(variableNames))
	{
		let sortedNames = variableNames.createListCopy();
		sortedNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		for (let i = 0; i < sortedNames.size(); i++)
		{
			let name = sortedNames.get(i);
			let value = this.getVariable(name);
			if (resolve === true)
			{
				value = this.resolveString(value);
				if (oFF.isNull(value))
				{
					value = oFF.XStringUtils.concatenate2("Cannot resolve: ", value);
				}
			}
			buffer.append(name).append("=").append(value).appendNewLine();
		}
	}
	return buffer.toString();
};
oFF.XEnvironment.prototype.getAllLockableProperties = function()
{
	return this.m_lockableProperties;
};
oFF.XEnvironment.prototype.getAllPrefixMatches = function(prefix)
{
	let result = oFF.XList.create();
	let keys = this.m_properties.getKeysAsReadOnlyList();
	for (let i = 0; i < keys.size(); i++)
	{
		let theKey = keys.get(i);
		if (oFF.XString.startsWith(theKey, prefix))
		{
			let value = this.m_properties.getByKey(theKey);
			let pair = oFF.XNameValuePair.create(theKey, value);
			result.add(pair);
		}
	}
	return result;
};
oFF.XEnvironment.prototype.getBooleanByKey = function(name)
{
	return this.getBooleanByKeyExt(name, false);
};
oFF.XEnvironment.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	let value = this.getStringByKey(name);
	let retValue = defaultValue;
	if (oFF.notNull(value))
	{
		if (oFF.XString.isEqual(value, "true") || oFF.XString.isEqual(value, "TRUE"))
		{
			retValue = true;
		}
		else if (oFF.XString.isEqual(value, "false") || oFF.XString.isEqual(value, "FALSE"))
		{
			retValue = false;
		}
	}
	return retValue;
};
oFF.XEnvironment.prototype.getByKey = function(key)
{
	let value = null;
	let targetKey = oFF.XEnvironment.normalizeKey(key);
	if (oFF.notNull(targetKey))
	{
		value = this.m_properties.getByKey(targetKey);
	}
	return value;
};
oFF.XEnvironment.prototype.getIntegerByKey = function(name)
{
	return this.getIntegerByKeyExt(name, 0);
};
oFF.XEnvironment.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	let value = this.getStringByKey(name);
	let retValue = defaultValue;
	if (oFF.notNull(value))
	{
		retValue = oFF.XInteger.convertFromStringWithDefault(value, defaultValue);
	}
	return retValue;
};
oFF.XEnvironment.prototype.getKeysAsReadOnlyList = function()
{
	return this.m_properties.getKeysAsReadOnlyList();
};
oFF.XEnvironment.prototype.getLogWriter = function()
{
	return this.m_logWriter;
};
oFF.XEnvironment.prototype.getLogWriterBase = function()
{
	return this.m_logWriter;
};
oFF.XEnvironment.prototype.getStringByKey = function(name)
{
	return this.getStringByKeyExt(name, null);
};
oFF.XEnvironment.prototype.getStringByKeyExt = function(name, defaultValue)
{
	let value = this.getVariable(name);
	let retValue = defaultValue;
	if (oFF.notNull(value))
	{
		retValue = this.replaceEnvVar(value, this, oFF.VarResolveMode.DOLLAR, false);
	}
	return retValue;
};
oFF.XEnvironment.prototype.getValuesAsReadOnlyList = function()
{
	return this.m_properties.getKeysAsReadOnlyList();
};
oFF.XEnvironment.prototype.getVariable = function(name)
{
	return this.getByKey(name);
};
oFF.XEnvironment.prototype.getVariableNames = function()
{
	return this.getKeysAsReadOnlyList();
};
oFF.XEnvironment.prototype.getVariableWithDefault = function(name, defaultValue)
{
	return this.hasVariable(name) ? this.getVariable(name) : defaultValue;
};
oFF.XEnvironment.prototype.hasElements = function()
{
	return this.m_properties.hasElements();
};
oFF.XEnvironment.prototype.hasVariable = function(name)
{
	return this.containsKey(name);
};
oFF.XEnvironment.prototype.isLocking = function()
{
	return this.m_isLocked;
};
oFF.XEnvironment.prototype.isVariableLocked = function(name)
{
	return this.m_isLocked && this.m_lockableProperties.contains(name) === true;
};
oFF.XEnvironment.prototype.put = function(key, element)
{
	if (oFF.notNull(element))
	{
		let targetKey = oFF.XEnvironment.normalizeKey(key);
		if (oFF.notNull(targetKey))
		{
			this.assertNotLocked(targetKey);
			this.m_properties.put(targetKey, element);
		}
	}
};
oFF.XEnvironment.prototype.putBoolean = function(key, booleanValue)
{
	this.putStringNotNull(key, oFF.XBoolean.convertToString(booleanValue));
};
oFF.XEnvironment.prototype.putInteger = function(name, intValue)
{
	this.putStringNotNull(name, oFF.XInteger.convertToString(intValue));
};
oFF.XEnvironment.prototype.putString = function(name, stringValue)
{
	this.putStringNotNull(name, stringValue);
};
oFF.XEnvironment.prototype.putStringNotNull = function(name, stringValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(name) && oFF.notNull(stringValue))
	{
		this.put(name, stringValue);
	}
};
oFF.XEnvironment.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(name) && oFF.XStringUtils.isNotNullAndNotEmpty(stringValue))
	{
		this.put(name, stringValue);
	}
};
oFF.XEnvironment.prototype.releaseObject = function()
{
	this.m_properties = oFF.XObjectExt.release(this.m_properties);
	this.m_lockableProperties = oFF.XObjectExt.release(this.m_lockableProperties);
	this.m_logWriter = null;
	oFF.DfAbstractMapByString.prototype.releaseObject.call( this );
};
oFF.XEnvironment.prototype.remove = function(key)
{
	let old = null;
	let targetKey = oFF.XEnvironment.normalizeKey(key);
	if (oFF.notNull(targetKey))
	{
		if (this.m_lockableProperties.contains(targetKey) === false)
		{
			this.assertNotLocked(targetKey);
			old = this.m_properties.remove(targetKey);
		}
	}
	return old;
};
oFF.XEnvironment.prototype.removeVariable = function(name)
{
	this.remove(name);
};
oFF.XEnvironment.prototype.replaceEnvVar = function(source, logger, varResolveMode, smartPathConcatenate)
{
	let target = source;
	while (oFF.notNull(target))
	{
		let startIndex = oFF.XString.indexOfFrom(target, varResolveMode.getPrefix(), 0);
		if (startIndex < 0)
		{
			break;
		}
		let endIndex = oFF.XString.indexOfFrom(target, varResolveMode.getPostfix(), startIndex + varResolveMode.getPrefixSize());
		if (endIndex >= 0)
		{
			let before = oFF.XString.substring(target, 0, startIndex);
			let varName = oFF.XString.substring(target, startIndex + varResolveMode.getPrefixSize(), endIndex);
			let after = oFF.XString.substring(target, endIndex + varResolveMode.getPostfixSize(), -1);
			let replaceValue = this.getVariable(varName);
			if (oFF.isNull(replaceValue))
			{
				if (oFF.notNull(logger))
				{
					logger.log4("Cannot resolve variable '", varName, "' used in ", source);
				}
				target = null;
				break;
			}
			if (smartPathConcatenate)
			{
				target = this.smartPathConcatenate(before, replaceValue);
				target = this.smartPathConcatenate(target, after);
			}
			else
			{
				target = oFF.XStringUtils.concatenate3(before, replaceValue, after);
			}
		}
	}
	return target;
};
oFF.XEnvironment.prototype.resolvePath = function(path)
{
	return this.replaceEnvVar(path, this, oFF.VarResolveMode.DOLLAR, true);
};
oFF.XEnvironment.prototype.resolveString = function(value)
{
	return this.replaceEnvVar(value, this, oFF.VarResolveMode.DOLLAR, false);
};
oFF.XEnvironment.prototype.retrieveNativeEnv = function()
{
	let nativeEnvironment = oFF.XSystemUtils.getNativeEnvironment();
	let nativeEnvironmentKeys = nativeEnvironment.getKeysAsReadOnlyList();
	let len = nativeEnvironmentKeys.size();
	for (let i = 0; i < len; i++)
	{
		let key = nativeEnvironmentKeys.get(i);
		this.put(key, nativeEnvironment.getByKey(key));
	}
};
oFF.XEnvironment.prototype.setLogWriter = function(logWriter)
{
	this.m_logWriter = logWriter;
};
oFF.XEnvironment.prototype.setVariable = function(name, value)
{
	this.put(name, value);
};
oFF.XEnvironment.prototype.setup = function()
{
	this.m_properties = oFF.XHashMapByString.create();
	this.m_logWriter = oFF.XLogger.getInstance();
	this.m_lockableProperties = oFF.XHashSetOfString.create();
};
oFF.XEnvironment.prototype.size = function()
{
	return this.m_properties.size();
};
oFF.XEnvironment.prototype.smartPathConcatenate = function(first, second)
{
	let theSecond = second;
	if (oFF.XString.containsString(first, oFF.XEnvironment.BACK_SLASH))
	{
		theSecond = oFF.XString.replace(second, oFF.XEnvironment.SLASH, oFF.XEnvironment.BACK_SLASH);
		if (oFF.XString.endsWith(first, oFF.XEnvironment.BACK_SLASH) && oFF.XString.startsWith(theSecond, oFF.XEnvironment.BACK_SLASH))
		{
			theSecond = oFF.XString.substring(theSecond, 1, -1);
		}
	}
	else if (oFF.XString.containsString(first, oFF.XEnvironment.SLASH))
	{
		theSecond = oFF.XString.replace(second, oFF.XEnvironment.BACK_SLASH, oFF.XEnvironment.SLASH);
		if (oFF.XString.endsWith(first, oFF.XEnvironment.SLASH) && oFF.XString.startsWith(theSecond, oFF.XEnvironment.SLASH))
		{
			theSecond = oFF.XString.substring(theSecond, 1, -1);
		}
	}
	return oFF.XStringUtils.concatenate2(first, theSecond);
};
oFF.XEnvironment.prototype.toResolvedString = function()
{
	return this.generateString(true);
};
oFF.XEnvironment.prototype.toString = function()
{
	return this.generateString(false);
};

oFF.XLineStringValue = function() {};
oFF.XLineStringValue.prototype = new oFF.AbstractMultiGeometry();
oFF.XLineStringValue.prototype._ff_c = "XLineStringValue";

oFF.XLineStringValue.WKT_KEY = "LINESTRING";
oFF.XLineStringValue.create = function()
{
	let linestring = new oFF.XLineStringValue();
	linestring.setup();
	return linestring;
};
oFF.XLineStringValue.createWithPoints = function(points)
{
	let newObj = new oFF.XLineStringValue();
	newObj.m_list = points;
	return newObj;
};
oFF.XLineStringValue.createWithWkt = function(wkt)
{
	if (oFF.isNull(wkt) || oFF.XString.indexOf(wkt, oFF.XLineStringValue.WKT_KEY) === -1 || oFF.XString.startsWith(wkt, "MULTILINESTRING"))
	{
		return null;
	}
	let newObj = oFF.XLineStringValue.create();
	let openingParenthesis = oFF.XString.indexOf(wkt, "(");
	let stringPoints = oFF.XString.substring(wkt, openingParenthesis + 1, oFF.XString.size(wkt) - 1);
	let points = oFF.XStringTokenizer.splitString(stringPoints, ",");
	for (let i = 0; i < points.size(); i++)
	{
		let currentPoint = oFF.XString.trim(points.get(i));
		let singlePoint = oFF.XStringTokenizer.splitString(currentPoint, " ");
		if (singlePoint.size() === 2)
		{
			let xPos = oFF.XDouble.convertFromString(singlePoint.get(0));
			let yPos = oFF.XDouble.convertFromString(singlePoint.get(1));
			newObj.createAndAddPoint(xPos, yPos);
		}
	}
	return newObj;
};
oFF.XLineStringValue.prototype.cloneExt = function(flags)
{
	let clone = oFF.XLineStringValue.create();
	this.cloneInternal(clone);
	return clone;
};
oFF.XLineStringValue.prototype.createAndAddPoint = function(posX, posY)
{
	this.m_list.add(oFF.XPointValue.createWithPosition(posX, posY));
};
oFF.XLineStringValue.prototype.getEndPoint = function()
{
	if (this.m_list.isEmpty())
	{
		return null;
	}
	return this.m_list.get(this.m_list.size() - 1);
};
oFF.XLineStringValue.prototype.getStartPoint = function()
{
	if (this.m_list.isEmpty())
	{
		return null;
	}
	return this.m_list.get(0);
};
oFF.XLineStringValue.prototype.getValueType = function()
{
	return oFF.XValueType.LINE_STRING;
};
oFF.XLineStringValue.prototype.isClosed = function()
{
	if (this.m_list.isEmpty())
	{
		return false;
	}
	if (this.isValid())
	{
		let firstPoint = this.getStartPoint();
		let lastPoint = this.getEndPoint();
		return oFF.XString.isEqual(firstPoint.toWKT(), lastPoint.toWKT());
	}
	return false;
};
oFF.XLineStringValue.prototype.isEqualTo = function(other)
{
	if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let xOther = other;
	return this.getValuesAsReadOnlyList().isEqualTo(xOther.getValuesAsReadOnlyList());
};
oFF.XLineStringValue.prototype.isValid = function()
{
	return this.m_list.size() >= 2;
};
oFF.XLineStringValue.prototype.resetValue = function(value)
{
	oFF.AbstractMultiGeometry.prototype.resetValue.call( this , value);
	if (this !== value)
	{
		this.resetValueInternal(value);
	}
};
oFF.XLineStringValue.prototype.toWKT = function()
{
	let wkt = oFF.XStringBuffer.create();
	wkt.append(oFF.XLineStringValue.WKT_KEY).append(" ");
	if (this.m_list.isEmpty())
	{
		wkt.append(oFF.AbstractGeometry.WKT_EMTPY);
	}
	else
	{
		wkt.append("(").append(this.toString()).append(")");
	}
	return wkt.toString();
};

oFF.XMultiLineStringValue = function() {};
oFF.XMultiLineStringValue.prototype = new oFF.AbstractMultiGeometry();
oFF.XMultiLineStringValue.prototype._ff_c = "XMultiLineStringValue";

oFF.XMultiLineStringValue.WKT_KEY = "MULTILINESTRING";
oFF.XMultiLineStringValue.create = function()
{
	let newObj = new oFF.XMultiLineStringValue();
	newObj.setup();
	return newObj;
};
oFF.XMultiLineStringValue.createWithLineStrings = function(lineStrings)
{
	let newObj = new oFF.XMultiLineStringValue();
	newObj.m_list = lineStrings;
	return newObj;
};
oFF.XMultiLineStringValue.createWithWkt = function(wkt)
{
	if (oFF.isNull(wkt) || oFF.XString.indexOf(wkt, oFF.XMultiLineStringValue.WKT_KEY) === -1)
	{
		return null;
	}
	let newObj = oFF.XMultiLineStringValue.create();
	let openingParenthesis = oFF.XString.indexOf(wkt, "((");
	let stringPoints = oFF.XString.substring(wkt, openingParenthesis + 1, oFF.XString.size(wkt) - 1);
	let lineStrings = oFF.XStringTokenizer.splitString(stringPoints, "),");
	for (let i = 0; i < lineStrings.size(); i++)
	{
		let currentLineString = oFF.XString.trim(lineStrings.get(i));
		currentLineString = oFF.XString.replace(currentLineString, "(", "");
		currentLineString = oFF.XString.replace(currentLineString, ")", "");
		let currentLineStringPoints = oFF.XStringTokenizer.splitString(currentLineString, ",");
		if (oFF.notNull(currentLineStringPoints))
		{
			if (currentLineStringPoints.size() > 0)
			{
				let newLineString = oFF.XLineStringValue.create();
				for (let n = 0; n < currentLineStringPoints.size(); n++)
				{
					let currentPoint = oFF.XString.trim(currentLineStringPoints.get(n));
					let singlePoint = oFF.XStringTokenizer.splitString(currentPoint, " ");
					if (singlePoint.size() === 2)
					{
						let xPos = oFF.XDouble.convertFromString(singlePoint.get(0));
						let yPos = oFF.XDouble.convertFromString(singlePoint.get(1));
						newLineString.createAndAddPoint(xPos, yPos);
					}
				}
				newObj.add(newLineString);
			}
		}
	}
	return newObj;
};
oFF.XMultiLineStringValue.prototype.cloneExt = function(flags)
{
	let clone = oFF.XMultiLineStringValue.create();
	this.cloneInternal(clone);
	return clone;
};
oFF.XMultiLineStringValue.prototype.createAndAddLineStringWithWKT = function(lineStringWkt)
{
	let newLineString = oFF.XLineStringValue.createWithWkt(lineStringWkt);
	this.m_list.add(newLineString);
};
oFF.XMultiLineStringValue.prototype.getValueType = function()
{
	return oFF.XValueType.MULTI_LINE_STRING;
};
oFF.XMultiLineStringValue.prototype.isEqualTo = function(other)
{
	if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let xOther = other;
	return this.getValuesAsReadOnlyList().isEqualTo(xOther.getValuesAsReadOnlyList());
};
oFF.XMultiLineStringValue.prototype.resetValue = function(value)
{
	oFF.AbstractMultiGeometry.prototype.resetValue.call( this , value);
	if (this !== value)
	{
		this.resetValueInternal(value);
	}
};
oFF.XMultiLineStringValue.prototype.toString = function()
{
	let returnString = oFF.XStringBuffer.create();
	for (let i = 0; i < this.m_list.size(); i++)
	{
		let currentLineString = this.m_list.get(i);
		returnString.append("(").append(currentLineString.toString()).append(")");
		if (i + 1 < this.m_list.size())
		{
			returnString.append(",");
		}
	}
	return returnString.toString();
};
oFF.XMultiLineStringValue.prototype.toWKT = function()
{
	let wkt = oFF.XStringBuffer.create();
	wkt.append(oFF.XMultiLineStringValue.WKT_KEY).append(" ");
	if (this.isEmpty())
	{
		wkt.append(oFF.AbstractGeometry.WKT_EMTPY);
	}
	else
	{
		wkt.append("(").append(this.toString()).append(")");
	}
	return wkt.toString();
};

oFF.XMultiPointValue = function() {};
oFF.XMultiPointValue.prototype = new oFF.AbstractMultiGeometry();
oFF.XMultiPointValue.prototype._ff_c = "XMultiPointValue";

oFF.XMultiPointValue.WKT_POINT = "POINT";
oFF.XMultiPointValue.WKT_START = "MULTIPOINT";
oFF.XMultiPointValue.create = function()
{
	let multiPoint = new oFF.XMultiPointValue();
	multiPoint.setup();
	return multiPoint;
};
oFF.XMultiPointValue.createWithWkt = function(wkt)
{
	if (oFF.isNull(wkt) || oFF.XString.indexOf(wkt, oFF.XMultiPointValue.WKT_START) === -1)
	{
		return null;
	}
	let multiPoint = oFF.XMultiPointValue.create();
	let indexOf = oFF.XString.indexOf(wkt, "(");
	let stringPoints = oFF.XString.substring(wkt, indexOf + 1, oFF.XString.size(wkt) - 1);
	let splitString = oFF.XStringTokenizer.splitString(stringPoints, ",");
	let iterator = splitString.getIterator();
	while (iterator.hasNext())
	{
		let stringPoint = iterator.next();
		if (!oFF.XString.containsString(stringPoints, "("))
		{
			stringPoint = oFF.XStringUtils.concatenate2("(", stringPoint);
		}
		if (!oFF.XString.containsString(stringPoints, ")"))
		{
			stringPoint = oFF.XStringUtils.concatenate2(stringPoint, ")");
		}
		let aPoint = oFF.XStringUtils.concatenate2(oFF.XMultiPointValue.WKT_POINT, stringPoint);
		multiPoint.add(oFF.XPointValue.createWithWkt(aPoint));
	}
	return multiPoint;
};
oFF.XMultiPointValue.prototype.cloneExt = function(flags)
{
	let clone = oFF.XMultiPointValue.create();
	this.cloneInternal(clone);
	return clone;
};
oFF.XMultiPointValue.prototype.getValueType = function()
{
	return oFF.XValueType.MULTI_POINT;
};
oFF.XMultiPointValue.prototype.isEqualTo = function(other)
{
	if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let xOther = other;
	if (this.m_list.size() !== xOther.size())
	{
		return false;
	}
	for (let pointIdx = 0; pointIdx < this.m_list.size(); pointIdx++)
	{
		if (!this.m_list.get(pointIdx).isEqualTo(xOther.get(pointIdx)))
		{
			return false;
		}
	}
	return true;
};
oFF.XMultiPointValue.prototype.resetValue = function(value)
{
	oFF.AbstractMultiGeometry.prototype.resetValue.call( this , value);
	if (this !== value)
	{
		this.resetValueInternal(value);
	}
};
oFF.XMultiPointValue.prototype.toWKT = function()
{
	return oFF.XStringUtils.concatenate4(oFF.XMultiPointValue.WKT_START, " (", this.toString(), ")");
};

oFF.XMultiPolygonValue = function() {};
oFF.XMultiPolygonValue.prototype = new oFF.AbstractMultiGeometry();
oFF.XMultiPolygonValue.prototype._ff_c = "XMultiPolygonValue";

oFF.XMultiPolygonValue.WKT_POLY_START = "POLYGON ";
oFF.XMultiPolygonValue.WKT_START = "MULTIPOLYGON";
oFF.XMultiPolygonValue.create = function()
{
	let multiPolygon = new oFF.XMultiPolygonValue();
	multiPolygon.setup();
	return multiPolygon;
};
oFF.XMultiPolygonValue.createWithWkt = function(wkt)
{
	if (oFF.isNull(wkt) || oFF.XString.indexOf(wkt, oFF.XMultiPolygonValue.WKT_START) === -1)
	{
		return null;
	}
	let multiPolygon = oFF.XMultiPolygonValue.create();
	let openingParenthesis = oFF.XString.indexOf(wkt, "(((");
	let stringPolygons = oFF.XString.substring(wkt, openingParenthesis + 1, oFF.XString.size(wkt) - 1);
	let polygons = oFF.XStringTokenizer.splitString(stringPolygons, ")),");
	let polyIterator = polygons.getIterator();
	while (polyIterator.hasNext())
	{
		let buffer = oFF.XStringBuffer.create();
		buffer.append(oFF.XMultiPolygonValue.WKT_POLY_START).append(polyIterator.next()).append("))");
		let polygon = oFF.XPolygonValue.createWithWkt(buffer.toString());
		multiPolygon.add(polygon);
	}
	return multiPolygon;
};
oFF.XMultiPolygonValue.prototype.add = function(element)
{
	this.m_list.add(element);
};
oFF.XMultiPolygonValue.prototype.clear = function()
{
	this.m_list.clear();
};
oFF.XMultiPolygonValue.prototype.cloneExt = function(flags)
{
	let clone = oFF.XMultiPolygonValue.create();
	this.cloneInternal(clone);
	return clone;
};
oFF.XMultiPolygonValue.prototype.getValueType = function()
{
	return oFF.XValueType.MULTI_POLYGON;
};
oFF.XMultiPolygonValue.prototype.insert = function(index, element)
{
	this.m_list.insert(index, element);
};
oFF.XMultiPolygonValue.prototype.isEqualTo = function(other)
{
	if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call( this , other))
	{
		return false;
	}
	let xOther = other;
	if (this.m_list.size() !== xOther.size())
	{
		return false;
	}
	for (let polyIdx = 0; polyIdx < this.m_list.size(); polyIdx++)
	{
		if (!this.m_list.get(polyIdx).isEqualTo(xOther.get(polyIdx)))
		{
			return false;
		}
	}
	return true;
};
oFF.XMultiPolygonValue.prototype.removeAt = function(index)
{
	return this.m_list.removeAt(index);
};
oFF.XMultiPolygonValue.prototype.removeElement = function(element)
{
	this.m_list.removeElement(element);
	return element;
};
oFF.XMultiPolygonValue.prototype.resetValue = function(value)
{
	oFF.AbstractMultiGeometry.prototype.resetValue.call( this , value);
	if (this === value)
	{
		return;
	}
	this.resetValueInternal(value);
};
oFF.XMultiPolygonValue.prototype.set = function(index, element)
{
	this.m_list.set(index, element);
};
oFF.XMultiPolygonValue.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate3("(", oFF.AbstractMultiGeometry.prototype.toString.call( this ), ")");
};
oFF.XMultiPolygonValue.prototype.toWKT = function()
{
	return oFF.XStringUtils.concatenate3(oFF.XMultiPolygonValue.WKT_START, " ", this.toString());
};

oFF.CommonsExtModule = function() {};
oFF.CommonsExtModule.prototype = new oFF.DfModule();
oFF.CommonsExtModule.prototype._ff_c = "CommonsExtModule";

oFF.CommonsExtModule.s_module = null;
oFF.CommonsExtModule.getInstance = function()
{
	if (oFF.isNull(oFF.CommonsExtModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.CommonsNativeModule.getInstance());
		oFF.CommonsExtModule.s_module = oFF.DfModule.startExt(new oFF.CommonsExtModule());
		oFF.VarResolveMode.staticSetup();
		oFF.LifeCycleState.staticSetup();
		oFF.DateConstants.staticSetup();
		oFF.TimeZonesConstants.staticSetup();
		oFF.DateFormatterConstants.staticSetup();
		oFF.RgCellType.staticSetup();
		oFF.XDateTimeFactoryImpl.staticSetup();
		oFF.XNumberFormatterSettingsFactoryImpl.staticSetup();
		let stdio = oFF.XStdio.getInstance();
		if (oFF.notNull(stdio))
		{
			let stdlog = stdio.getStdlog();
			let stderr = stdio.getStderr();
			if (oFF.notNull(stdlog))
			{
				let logWriter = oFF.XLogWriter.create(stdlog, stderr);
				logWriter.setLogFilterLevel(0);
				logWriter.enableAllLogLayers();
				oFF.XLogger.setInstance(logWriter);
			}
		}
		oFF.DfModule.stopExt(oFF.CommonsExtModule.s_module);
	}
	return oFF.CommonsExtModule.s_module;
};
oFF.CommonsExtModule.prototype.getName = function()
{
	return "ff0060.commons.ext";
};

oFF.CommonsExtModule.getInstance();

return oFF;
} );