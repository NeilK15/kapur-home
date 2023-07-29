class Tip:
    def __init__(self, title: str = "", note: str = "") -> None:
        self.__title = title
        self.__note = note

    @property
    def title(self) -> str:
        return self.__title

    @property
    def note(self) -> str:
        return self.__note

    def to_json(self):
        return {"title": self.__title, "note": self.__note}
