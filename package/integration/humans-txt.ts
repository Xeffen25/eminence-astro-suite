import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IntegrationRuntimeContext } from ".";

export const HUMANS_TXT_RECOMMENDATION =
  "Recommendation: visit todo.com/link-on-how-to-create-humans-txt-for-your-astro-site to learn how to create a humans.txt for your Astro site.";

export const HUMANS_TXT_BUILD_OUTPUT_RELATIVE_PATH = "/humans.txt";
const HUMANS_TXT_BUILD_OUTPUT_FILENAME = "humans.txt";

const doesPathExist = async (targetPath: string): Promise<boolean> => {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
};

export async function validateHumansTxtInBuildOutput({
  dir,
  options,
  logger,
}: IntegrationRuntimeContext): Promise<void> {
  const humansTxtOption = options.headTags?.humansTxt;

  if (humansTxtOption === false) {
    return;
  }

  if (humansTxtOption === undefined) {
    logger.warn(
      `No humans.txt file was generated because humansTxt is undefined. ${HUMANS_TXT_RECOMMENDATION}`,
    );
    return;
  }

  const humansTxtBuildOutputPath = join(
    fileURLToPath(dir),
    HUMANS_TXT_BUILD_OUTPUT_FILENAME,
  );
  const humansTxtFileExistsInBuildOutput = await doesPathExist(
    humansTxtBuildOutputPath,
  );

  if (!humansTxtFileExistsInBuildOutput) {
    logger.warn(
      `humans.txt was not found in the build output. ${HUMANS_TXT_RECOMMENDATION}`,
    );
  }
}
