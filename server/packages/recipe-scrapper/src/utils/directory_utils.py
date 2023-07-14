import os


def make_directory(path: str) -> bool:
    """
    Makes a directory at the specified path and returns True. If the directory
    already exists, then false is returned.
    """
    if path == None:
        raise SyntaxError("Please specify a path")

    if os.access(path, os.R_OK):
        print(f"Directory Exists:\t {path}")
        return False

    os.mkdir(path)
    print(f"Directory Created\t {path}")

    return True


def make_file(directoryPath: str, fileName: str) -> bool:
    """
    Makes a file at the specified path and file name.
    """

    if directoryPath == None:
        raise SyntaxError("Please specify a directory path")

    if fileName == None:
        raise SyntaxError("Please specify a file name")

    fileDescriptiorPath = "/".join([directoryPath, fileName])

    if os.path.isfile(fileDescriptiorPath):
        print(f"File Exists:\t {fileName} at {fileDescriptiorPath}")
        return False

    open(fileDescriptiorPath, "w")

    print(f"File Created:\t {fileName} at {fileDescriptiorPath}")
    return True
