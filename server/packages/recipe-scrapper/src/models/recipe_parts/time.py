from enum import Enum


class TimeUnit(Enum):
    UNIT_MINUTES = "mins"
    UNIT_HOURS = "hours"


class Time:
    def __init__(self, value: int = None, unit: TimeUnit = None) -> None:
        self.__value = value
        self.__unit = unit

    @property
    def value(self) -> int:
        return self.__value

    @property
    def unit(self) -> TimeUnit:
        return self.__unit
